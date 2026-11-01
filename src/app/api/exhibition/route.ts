/**
 * TABLE: public.exhibition_registrations
 * Columns: id (uuid, PK, default: gen_random_uuid()), full_name (text, NOT NULL),
 *   email (text, optional), phone_number (text, NOT NULL),
 *   program_of_study (text, NOT NULL), project_name (text, NOT NULL),
 *   project_explanation (text, NOT NULL), mvp_demo_url (text, NOT NULL — path in the
 *   private "mvp-demos" bucket), created_at
 * The demo file is uploaded by the browser directly to Supabase (see /api/uploads).
 */

import { NextResponse } from "next/server"
import { z } from "zod"
import { resolveSupabaseForRoute } from "@/lib/supabase/resolve-supabase-route"
import { isBot } from "@/lib/honeypot"
import { confirmUploaded, verifyTicket } from "@/lib/uploads"
import { notifySubmission } from "@/lib/notify"

const exhibitionBody = z.object({
  full_name: z.string().trim().min(1).max(300),
  email: z
    .string()
    .trim()
    .max(254)
    .optional()
    .transform((v) => (v ? v : undefined))
    .pipe(z.email().optional()),
  phone_number: z.string().trim().min(1).max(60),
  program_of_study: z.string().trim().min(1).max(300),
  project_name: z.string().trim().min(1).max(300),
  project_explanation: z.string().trim().min(1).max(5000),
  mvp_path: z.string().max(200),
  mvp_ticket: z.string().max(200),
  website: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const json = await request.json().catch(() => null)
    if (json && isBot((json as { website?: unknown }).website)) {
      return NextResponse.json({ ok: true })
    }

    const parsed = exhibitionBody.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid exhibition registration", issues: z.flattenError(parsed.error) },
        { status: 400 },
      )
    }
    const d = parsed.data

    if (!verifyTicket("mvp", d.mvp_path, d.mvp_ticket)) {
      return NextResponse.json({ error: "MVP / demo file is required" }, { status: 400 })
    }

    const supabase = await resolveSupabaseForRoute()
    if (!(await confirmUploaded(supabase, "mvp", d.mvp_path))) {
      return NextResponse.json({ error: "Demo file upload was not found. Please upload it again." }, { status: 400 })
    }

    const { error } = await supabase.from("exhibition_registrations").insert({
      full_name: d.full_name,
      email: d.email ?? null,
      phone_number: d.phone_number,
      program_of_study: d.program_of_study,
      project_name: d.project_name,
      project_explanation: d.project_explanation,
      mvp_demo_url: d.mvp_path,
    })

    if (error) {
      console.error("exhibition_registrations insert failed:", error.message)
      return NextResponse.json({ error: "Could not save registration" }, { status: 500 })
    }

    notifySubmission("exhibition project", { Name: d.full_name, Project: d.project_name, Phone: d.phone_number })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[/api/exhibition]", error)
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 })
  }
}
