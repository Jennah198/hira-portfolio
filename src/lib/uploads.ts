import { createHmac, randomUUID, timingSafeEqual } from "node:crypto"
import type { SupabaseClient } from "@supabase/supabase-js"

/**
 * Direct-to-Supabase uploads (browser → storage), so files never pass through Vercel's
 * 4.5 MB request limit. Flow:
 *   1. POST /api/uploads  → server checks Turnstile + type/size, returns a one-time signed
 *      upload URL and a short-lived HMAC "ticket" bound to the object path.
 *   2. Browser PUTs the file to the signed URL.
 *   3. The form endpoint receives { path, ticket }, verifies the ticket and that the object
 *      exists with an allowed size, then saves the row.
 * Buckets also enforce file_size_limit + allowed_mime_types server-side (set in Supabase).
 */

export const UPLOAD_KINDS = {
  receipt: {
    bucket: "receipts",
    folder: "graduation",
    maxBytes: 10 * 1024 * 1024,
    types: { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "application/pdf": "pdf" },
  },
  mvp: {
    bucket: "mvp-demos",
    folder: "exhibition",
    maxBytes: 30 * 1024 * 1024,
    types: {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "application/pdf": "pdf",
      "video/mp4": "mp4",
      "video/webm": "webm",
      "application/zip": "zip",
      "application/x-zip-compressed": "zip",
    },
  },
} as const

export type UploadKind = keyof typeof UPLOAD_KINDS

export function isUploadKind(v: unknown): v is UploadKind {
  return typeof v === "string" && v in UPLOAD_KINDS
}

const TICKET_TTL_SECONDS = 60 * 60

function ticketSecret(): string {
  const s = process.env.ADMIN_SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!s) throw new Error("ADMIN_SESSION_SECRET (or SUPABASE_SERVICE_ROLE_KEY) must be set")
  return `upload-ticket:${s}`
}

function sign(value: string) {
  return createHmac("sha256", ticketSecret()).update(value).digest("hex")
}

export function newObjectPath(kind: UploadKind, contentType: string): string | null {
  const ext = (UPLOAD_KINDS[kind].types as Record<string, string>)[contentType]
  return ext ? `${UPLOAD_KINDS[kind].folder}/${randomUUID()}.${ext}` : null
}

export function createTicket(kind: UploadKind, path: string): string {
  const exp = Math.floor(Date.now() / 1000) + TICKET_TTL_SECONDS
  return `${exp}.${sign(`${kind}:${path}:${exp}`)}`
}

export function verifyTicket(kind: UploadKind, path: unknown, ticket: unknown): path is string {
  if (typeof path !== "string" || typeof ticket !== "string") return false
  const folder = UPLOAD_KINDS[kind].folder
  if (!new RegExp(`^${folder}/[0-9a-f-]{36}\\.[a-z0-9]{2,5}$`).test(path)) return false
  const [exp, mac] = ticket.split(".")
  if (!exp || !mac || !/^\d+$/.test(exp) || Number(exp) < Date.now() / 1000) return false
  const expected = Buffer.from(sign(`${kind}:${path}:${exp}`))
  const given = Buffer.from(mac)
  return expected.length === given.length && timingSafeEqual(expected, given)
}

/** Confirms the browser actually uploaded the object and it respects the size limit. */
export async function confirmUploaded(supabase: SupabaseClient, kind: UploadKind, path: string): Promise<boolean> {
  const { bucket, maxBytes } = UPLOAD_KINDS[kind]
  const { data, error } = await supabase.storage.from(bucket).info(path)
  if (error || !data) return false
  const size = Number((data as { size?: number }).size ?? 0)
  return size > 0 && size <= maxBytes
}
