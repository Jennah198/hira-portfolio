import type { SupabaseClient } from "@supabase/supabase-js"

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function safeDecodeURIComponent(s: string): string {
  try {
    return decodeURIComponent(s)
  } catch {
    return s
  }
}

/**
 * Returns the object key/path inside the bucket (e.g. `graduation/uuid.pdf`),
 * from either a full Supabase Storage URL or an already-relative path.
 */
export function extractStorageObjectPath(value: string, bucketName: string): string {
  const v = value.trim()
  if (!v) return ""

  if (v.includes("supabase.co")) {
    const publicMarker = `/object/public/${bucketName}/`
    const pubIdx = v.indexOf(publicMarker)
    if (pubIdx !== -1) {
      return safeDecodeURIComponent(v.slice(pubIdx + publicMarker.length).split("?")[0] ?? "")
    }

    const signMatch = v.match(
      new RegExp(`/object/sign/${escapeRegExp(bucketName)}/([^?]+)`),
    )
    if (signMatch?.[1]) {
      return safeDecodeURIComponent(signMatch[1])
    }

    const loose = v.match(new RegExp(`${escapeRegExp(bucketName)}/(.+?)(\\?|$)`))
    if (loose?.[1]) {
      return safeDecodeURIComponent(loose[1])
    }
  }

  if (v.startsWith(`${bucketName}/`)) {
    return v.slice(bucketName.length + 1)
  }

  return v
}

export async function signedUrlOrOriginal(
  supabase: SupabaseClient,
  bucketName: string,
  storedValue: string | null | undefined,
  expiresInSeconds = 3600,
): Promise<string | null> {
  if (storedValue == null) return null
  const raw = typeof storedValue === "string" ? storedValue.trim() : ""
  if (!raw) return null

  const objectPath = extractStorageObjectPath(raw, bucketName)
  if (!objectPath) {
    return raw
  }

  const { data, error } = await supabase.storage
    .from(bucketName)
    .createSignedUrl(objectPath, expiresInSeconds)

  if (error || !data?.signedUrl) {
    console.error(
      "[admin signed URL]",
      bucketName,
      "path:",
      objectPath,
      error?.message ?? "no signedUrl",
    )
    return raw
  }

  return data.signedUrl
}
