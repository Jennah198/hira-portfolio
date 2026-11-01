import type { Dictionary } from "@/i18n/dictionaries"
import { format } from "@/i18n/config"
import { getSubmissionErrorMessage } from "@/lib/submission-toasts"

type ApiPayload = { error?: string; details?: string; code?: string } | null

/** Translated message for known error codes, otherwise the server/fallback message. */
export function apiErrorMessage(payload: unknown, fallback: string, t: Dictionary): string {
  const p = payload as ApiPayload
  if (p?.code === "captcha") return t.common.captchaFailed
  if (p?.code === "bad_type") return t.common.fileType
  return getSubmissionErrorMessage(payload, fallback)
}

const EXT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  pdf: "application/pdf",
  mp4: "video/mp4",
  webm: "video/webm",
  zip: "application/zip",
}

function contentTypeOf(file: File): string {
  if (file.type) return file.type
  const ext = file.name.split(".").pop()?.toLowerCase() ?? ""
  return EXT_TYPES[ext] ?? "application/octet-stream"
}

/**
 * Uploads a file straight from the browser to Supabase Storage (bypasses Vercel's 4.5 MB limit).
 * Returns the storage path + server-signed ticket to send with the form.
 */
export async function uploadDirect(
  kind: "receipt" | "mvp",
  file: File,
  maxMb: number,
  turnstileToken: string | undefined,
  t: Dictionary,
): Promise<{ path: string; ticket: string } | { error: string }> {
  if (file.size > maxMb * 1024 * 1024) return { error: format(t.common.fileTooLarge, { mb: maxMb }) }

  const contentType = contentTypeOf(file)
  const res = await fetch("/api/uploads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind, contentType, size: file.size, turnstileToken }),
  })
  const payload = await res.json().catch(() => null)
  if (!res.ok) {
    if ((payload as ApiPayload)?.code === "too_large") return { error: format(t.common.fileTooLarge, { mb: maxMb }) }
    return { error: apiErrorMessage(payload, t.common.uploadFailed, t) }
  }

  const { signedUrl, path, ticket } = payload as { signedUrl: string; path: string; ticket: string }
  const put = await fetch(signedUrl, { method: "PUT", headers: { "Content-Type": contentType }, body: file })
  if (!put.ok) {
    if (put.status === 413) return { error: format(t.common.fileTooLarge, { mb: maxMb }) }
    if (put.status === 415) return { error: t.common.fileType }
    return { error: t.common.uploadFailed }
  }
  return { path, ticket }
}
