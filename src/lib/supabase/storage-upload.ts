import type { SupabaseClient } from "@supabase/supabase-js"

export const RECEIPT_MAX_BYTES = 10 * 1024 * 1024
export const MVP_MAX_BYTES = 30 * 1024 * 1024

function extensionFromFilename(name: string): string | null {
  const i = name.lastIndexOf(".")
  if (i <= 0 || i >= name.length - 1) return null
  const ext = name.slice(i + 1).toLowerCase()
  return /^[a-z0-9]{1,8}$/.test(ext) ? ext : null
}

function mimeAllowedForReceipt(mime: string): boolean {
  const t = mime.split(";")[0]?.trim().toLowerCase() ?? ""
  return t.startsWith("image/") || t === "application/pdf"
}

function mimeAllowedForMvp(mime: string): boolean {
  const t = mime.split(";")[0]?.trim().toLowerCase() ?? ""
  if (mimeAllowedForReceipt(t)) return true
  return t.startsWith("video/") || t === "application/zip" || t === "application/x-zip-compressed"
}

function extAllowedReceipt(ext: string): boolean {
  const e = ext === "jpeg" ? "jpg" : ext
  return ["jpg", "png", "webp", "pdf"].includes(e)
}

function extAllowedMvp(ext: string): boolean {
  const e = ext === "jpeg" ? "jpg" : ext
  return ["jpg", "png", "webp", "pdf", "mp4", "webm", "zip"].includes(e)
}

function normalizeExt(file: File, kind: "receipt" | "mvp"): string | null {
  const mime = file.type.split(";")[0]?.trim().toLowerCase() ?? ""
  const fromMime: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "application/pdf": "pdf",
    "video/mp4": "mp4",
    "video/webm": "webm",
    "application/zip": "zip",
    "application/x-zip-compressed": "zip",
  }
  if (mime && fromMime[mime]) {
    return fromMime[mime]
  }

  const raw = extensionFromFilename(file.name)
  if (!raw) return null
  const asJpg = raw === "jpeg" ? "jpg" : raw
  if (kind === "receipt" && extAllowedReceipt(asJpg)) return asJpg === "jpeg" ? "jpg" : asJpg
  if (kind === "mvp" && extAllowedMvp(asJpg)) return asJpg === "jpeg" ? "jpg" : asJpg
  return null
}

function fileTypeOk(file: File, kind: "receipt" | "mvp"): boolean {
  const mime = file.type.split(";")[0]?.trim().toLowerCase() ?? ""
  if (mime) {
    return kind === "receipt" ? mimeAllowedForReceipt(mime) : mimeAllowedForMvp(mime)
  }
  return normalizeExt(file, kind) !== null
}

export async function uploadFormFile(params: {
  supabase: SupabaseClient
  bucket: string
  file: File
  folder: string
  kind: "receipt" | "mvp"
}): Promise<{ publicUrl: string } | { error: string }> {
  const maxBytes = params.kind === "receipt" ? RECEIPT_MAX_BYTES : MVP_MAX_BYTES

  if (params.file.size > maxBytes) {
    return { error: `File is too large (max ${Math.round(maxBytes / (1024 * 1024))} MB)` }
  }

  if (!fileTypeOk(params.file, params.kind)) {
    return { error: "Unsupported file type" }
  }

  const ext = normalizeExt(params.file, params.kind)
  if (!ext) {
    return { error: "Could not determine file extension" }
  }

  const objectPath = `${params.folder}/${crypto.randomUUID()}.${ext}`
  const body = Buffer.from(await params.file.arrayBuffer())
  const mime = params.file.type.split(";")[0]?.trim().toLowerCase() ?? ""
  const contentType =
    mime ||
    (ext === "jpg"
      ? "image/jpeg"
      : ext === "png"
        ? "image/png"
        : ext === "webp"
          ? "image/webp"
          : ext === "pdf"
            ? "application/pdf"
            : ext === "mp4"
              ? "video/mp4"
              : ext === "webm"
                ? "video/webm"
                : ext === "zip"
                  ? "application/zip"
                  : "application/octet-stream")

  const { error } = await params.supabase.storage
    .from(params.bucket)
    .upload(objectPath, body, { contentType, upsert: false })

  if (error) {
    return { error: error.message }
  }

  const { data } = params.supabase.storage.from(params.bucket).getPublicUrl(objectPath)
  return { publicUrl: data.publicUrl }
}
