import { NextResponse } from "next/server"
import { z } from "zod"
import { resolveSupabaseForRoute } from "@/lib/supabase/resolve-supabase-route"

const contactPayload = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
  subject: z.string().optional(),
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

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid contact payload", issues: parsed.error.flatten() },
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
        { error: "Could not save message", details: error.message },
        { status: 500 },
      )
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unexpected server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
