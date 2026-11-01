/**
 * TABLE: public.contact_messages
 * Columns: id (uuid, PK, default: gen_random_uuid()), name (text, NOT NULL),
 *   email (text, NOT NULL), message (text, NOT NULL), created_at (timestamptz, default: now())
 * Written with the service role (RLS bypassed); no public policies required.
 * Storage: None (no file uploads)
 */

import { NextResponse } from "next/server"
import { z } from "zod"
import { resolveSupabaseForRoute } from "@/lib/supabase/resolve-supabase-route"
import { isBot } from "@/lib/honeypot"

const contactPayload = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().max(254).pipe(z.email()),
  message: z.string().trim().min(1).max(5000),
  subject: z.string().trim().max(300).optional(),
  website: z.string().optional(),
})

function buildStoredMessage(body: z.infer<typeof contactPayload>): string {
  const subject = body.subject?.trim()
  const message = body.message.trim()
  if (subject) {
    return `Subject: ${subject}\n\n${message}`
  }
  return message
}

export async function POST(request: Request) {
  try {
    const json = (await request.json()) as unknown
    const parsed = contactPayload.safeParse(json)
    if (parsed.success && isBot(parsed.data.website)) {
      return NextResponse.json({ ok: true })
    }

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid contact payload", issues: z.flattenError(parsed.error) },
        { status: 400 },
      )
    }

    const supabase = await resolveSupabaseForRoute()
    const { error } = await supabase.from("contact_messages").insert({
      name: parsed.data.name.trim(),
      email: parsed.data.email.trim(),
      message: buildStoredMessage(parsed.data),
    })

    if (error) {
      console.error("contact_messages insert failed:", error.message)
      return NextResponse.json(
        { error: "Could not save message" },
        { status: 500 },
      )
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[" + new URL(request.url).pathname + "]", error)
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 },
    )
  }
}
