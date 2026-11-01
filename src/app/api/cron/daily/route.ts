/**
 * Daily job (Vercel Cron, see vercel.json):
 *  1. Keeps the Supabase project active (free projects pause after ~7 days without activity).
 *  2. Enforces the data-retention policy (src/lib/retention.ts).
 *  3. Removes orphaned uploads (files uploaded for forms that were never submitted).
 * Vercel calls it with `Authorization: Bearer $CRON_SECRET`.
 * Add `?dryRun=1` to only report what would be deleted (no changes are made).
 */
import { NextResponse } from "next/server"
import type { SupabaseClient } from "@supabase/supabase-js"
import { createServiceRoleClient } from "@/lib/supabase/service"
import { EXPIRED_FILE, RETENTION, monthsAgo } from "@/lib/retention"
import { extractStorageObjectPath } from "@/lib/supabase/storage-signed-url"

/** Older rows store a full storage URL, newer ones a path — normalise to the object path. */
const toPath = (value: unknown, bucket: string) =>
  typeof value === "string" && value && value !== EXPIRED_FILE ? extractStorageObjectPath(value, bucket) : ""

export const dynamic = "force-dynamic"
export const maxDuration = 60

type FileTable = { table: string; column: string; bucket: string; folder: string }

const FILE_TABLES: FileTable[] = [
  { table: "graduation_registrations", column: "payment_receipt_url", bucket: "receipts", folder: "graduation" },
  { table: "exhibition_registrations", column: "mvp_demo_url", bucket: "mvp-demos", folder: "exhibition" },
]

async function deleteOlderThan(
  supabase: SupabaseClient,
  table: string,
  months: number,
  dryRun: boolean,
  fileCol?: FileTable,
) {
  const cutoff = monthsAgo(months)
  if (dryRun) {
    const { count, error } = await supabase.from(table).select("id", { head: true, count: "exact" }).lt("created_at", cutoff)
    if (error) throw new Error(`${table}: ${error.message}`)
    return count ?? 0
  }
  if (fileCol) {
    // Remove the stored files of rows being deleted (if not already expired).
    const { data } = await supabase.from(table).select(`id, ${fileCol.column}`).lt("created_at", cutoff)
    const paths = (data ?? [])
      .map((r) => toPath((r as unknown as Record<string, unknown>)[fileCol.column], fileCol.bucket))
      .filter(Boolean)
    if (paths.length) await supabase.storage.from(fileCol.bucket).remove(paths)
  }
  const { data, error } = await supabase.from(table).delete().lt("created_at", cutoff).select("id")
  if (error) throw new Error(`${table}: ${error.message}`)
  return data?.length ?? 0
}

async function expireFiles(supabase: SupabaseClient, ft: FileTable, dryRun: boolean) {
  const cutoff = monthsAgo(RETENTION.filesMonths)
  const { data, error } = await supabase
    .from(ft.table)
    .select(`id, ${ft.column}`)
    .lt("created_at", cutoff)
    .neq(ft.column, EXPIRED_FILE)
  if (error) throw new Error(`${ft.table}: ${error.message}`)
  const rows = (data ?? []) as unknown as Array<Record<string, string>>
  if (!rows.length || dryRun) return rows.length
  const paths = rows.map((r) => toPath(r[ft.column], ft.bucket)).filter(Boolean)
  if (paths.length) await supabase.storage.from(ft.bucket).remove(paths)
  await supabase
    .from(ft.table)
    .update({ [ft.column]: EXPIRED_FILE })
    .in(
      "id",
      rows.map((r) => r.id),
    )
  return rows.length
}

async function removeOrphans(supabase: SupabaseClient, ft: FileTable, dryRun: boolean) {
  const cutoff = Date.now() - RETENTION.orphanHours * 3600 * 1000
  const { data: files, error } = await supabase.storage
    .from(ft.bucket)
    .list(ft.folder, { limit: 1000, sortBy: { column: "created_at", order: "asc" } })
  if (error) throw new Error(`${ft.bucket}: ${error.message}`)
  const old = (files ?? []).filter((f) => f.id && f.created_at && new Date(f.created_at).getTime() < cutoff)
  if (!old.length) return 0

  const { data: rows } = await supabase.from(ft.table).select(ft.column)
  const referenced = new Set(
    (rows ?? []).map((r) => toPath((r as unknown as Record<string, unknown>)[ft.column], ft.bucket)),
  )
  const orphans = old.map((f) => `${ft.folder}/${f.name}`).filter((p) => !referenced.has(p))
  if (orphans.length && !dryRun) await supabase.storage.from(ft.bucket).remove(orphans)
  return orphans.length
}

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const supabase = createServiceRoleClient()
  if (!supabase) return NextResponse.json({ error: "Missing Supabase configuration" }, { status: 500 })

  const dryRun = new URL(request.url).searchParams.get("dryRun") === "1"
  const report: Record<string, number | string> = { mode: dryRun ? "dry-run (nothing changed)" : "live" }
  const step = async (name: string, fn: () => Promise<number | string>) => {
    try {
      report[name] = await fn()
    } catch (err) {
      report[name] = `error: ${err instanceof Error ? err.message : String(err)}`
      console.error(`[cron] ${name}`, err)
    }
  }

  await step("keepalive", async () => {
    const { error } = await supabase.from("membership").select("id", { head: true, count: "exact" })
    if (error) throw error
    return "ok"
  })
  for (const ft of FILE_TABLES) await step(`expiredFiles:${ft.bucket}`, () => expireFiles(supabase, ft, dryRun))
  await step("deleted:contact_messages", () => deleteOlderThan(supabase, "contact_messages", RETENTION.contactMonths, dryRun))
  await step("deleted:graduation_registrations", () =>
    deleteOlderThan(supabase, "graduation_registrations", RETENTION.registrationsMonths, dryRun, FILE_TABLES[0]),
  )
  await step("deleted:exhibition_registrations", () =>
    deleteOlderThan(supabase, "exhibition_registrations", RETENTION.registrationsMonths, dryRun, FILE_TABLES[1]),
  )
  await step("deleted:exhibition_guest_registrations", () =>
    deleteOlderThan(supabase, "exhibition_guest_registrations", RETENTION.registrationsMonths, dryRun),
  )
  await step("deleted:membership", () => deleteOlderThan(supabase, "membership", RETENTION.membershipMonths, dryRun))
  for (const ft of FILE_TABLES) await step(`orphans:${ft.bucket}`, () => removeOrphans(supabase, ft, dryRun))

  console.log("[cron] daily report", report)
  const failed = Object.values(report).some((v) => typeof v === "string" && v.startsWith("error"))
  return NextResponse.json({ ok: !failed, report }, { status: failed ? 500 : 200 })
}
