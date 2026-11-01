/**
 * Admin records API (requires admin session).
 *   GET    /api/admin/records/:type          → { data: rows[] } newest first; file columns become 1-hour signed URLs
 *   DELETE /api/admin/records/:type?id=uuid  → deletes the row and its stored file
 */
import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-auth"
import { createServiceRoleClient } from "@/lib/supabase/service"
import { extractStorageObjectPath, signedUrlOrOriginal } from "@/lib/supabase/storage-signed-url"
import { EXPIRED_FILE } from "@/lib/retention"

const RECORD_TYPES = {
  membership: { table: "membership" },
  contact: { table: "contact_messages" },
  graduation: { table: "graduation_registrations", file: { column: "payment_receipt_url", bucket: "receipts" } },
  exhibition: { table: "exhibition_registrations", file: { column: "mvp_demo_url", bucket: "mvp-demos" } },
  "exhibition-guests": { table: "exhibition_guest_registrations" },
} as const

type RecordType = keyof typeof RECORD_TYPES
type Config = { table: string; file?: { column: string; bucket: string } }

function resolve(type: string): Config | null {
  return type in RECORD_TYPES ? (RECORD_TYPES[type as RecordType] as Config) : null
}

type Ctx = { params: Promise<{ type: string }> }

export async function GET(_request: Request, { params }: Ctx) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  const config = resolve((await params).type)
  if (!config) return NextResponse.json({ error: "Unknown record type" }, { status: 404 })
  const supabase = createServiceRoleClient()
  if (!supabase) return NextResponse.json({ error: "Missing Supabase configuration" }, { status: 500 })

  const { data, error } = await supabase.from(config.table).select("*").order("created_at", { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const rows = (data ?? []) as Record<string, unknown>[]
  if (config.file) {
    const { column, bucket } = config.file
    await Promise.all(
      rows.map(async (row) => {
        const value = row[column]
        if (typeof value === "string" && value && value !== EXPIRED_FILE) {
          row[column] = await signedUrlOrOriginal(supabase, bucket, value, 3600)
        }
      }),
    )
  }
  return NextResponse.json({ data: rows })
}

export async function DELETE(request: Request, { params }: Ctx) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  const config = resolve((await params).type)
  if (!config) return NextResponse.json({ error: "Unknown record type" }, { status: 404 })
  const id = new URL(request.url).searchParams.get("id") ?? ""
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 })

  const supabase = createServiceRoleClient()
  if (!supabase) return NextResponse.json({ error: "Missing Supabase configuration" }, { status: 500 })

  const { data, error } = await supabase.from(config.table).delete().eq("id", id).select("*")
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data?.length) return NextResponse.json({ error: "Record not found" }, { status: 404 })

  if (config.file) {
    const stored = (data[0] as Record<string, unknown>)[config.file.column]
    if (typeof stored === "string" && stored && stored !== EXPIRED_FILE) {
      // Older rows store a full storage URL, newer ones the object path.
      const path = extractStorageObjectPath(stored, config.file.bucket)
      const { error: rmError } = await supabase.storage.from(config.file.bucket).remove([path])
      if (rmError) console.error("[admin delete] file removal failed:", rmError.message)
    }
  }
  return NextResponse.json({ ok: true })
}
