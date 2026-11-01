/**
 * POST { kind: "receipt" | "mvp", contentType, size, turnstileToken }
 * → { signedUrl, path, ticket }  (browser then PUTs the file directly to Supabase Storage)
 */
import { NextResponse } from "next/server"
import { z } from "zod"
import { resolveSupabaseForRoute } from "@/lib/supabase/resolve-supabase-route"
import { captchaFailed, clientIp, verifyTurnstile } from "@/lib/turnstile"
import { UPLOAD_KINDS, createTicket, isUploadKind, newObjectPath } from "@/lib/uploads"

const body = z.object({
  kind: z.string(),
  contentType: z.string().max(100),
  size: z.number().int().positive(),
  turnstileToken: z.string().max(2048).optional(),
})

export async function POST(request: Request) {
  try {
    const parsed = body.safeParse(await request.json().catch(() => null))
    if (!parsed.success || !isUploadKind(parsed.data.kind)) {
      return NextResponse.json({ error: "Invalid upload request" }, { status: 400 })
    }
    const { kind, size, turnstileToken } = parsed.data
    const contentType = parsed.data.contentType.split(";")[0].trim().toLowerCase()
    const rules = UPLOAD_KINDS[kind]

    if (!(await verifyTurnstile(turnstileToken, clientIp(request)))) return captchaFailed()

    if (size > rules.maxBytes) {
      return NextResponse.json(
        { error: `File is too large (max ${Math.round(rules.maxBytes / (1024 * 1024))} MB)`, code: "too_large" },
        { status: 400 },
      )
    }
    const path = newObjectPath(kind, contentType)
    if (!path) {
      return NextResponse.json({ error: "Unsupported file type", code: "bad_type" }, { status: 400 })
    }

    const supabase = await resolveSupabaseForRoute()
    const { data, error } = await supabase.storage.from(rules.bucket).createSignedUploadUrl(path)
    if (error || !data) {
      console.error("createSignedUploadUrl failed:", error?.message)
      return NextResponse.json({ error: "Could not prepare upload" }, { status: 500 })
    }

    return NextResponse.json({ signedUrl: data.signedUrl, path, ticket: createTicket(kind, path) })
  } catch (error) {
    console.error("[/api/uploads]", error)
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 })
  }
}
