/**
 * TABLE: public.exhibition_registrations
 * Columns: id (uuid, PK, default: gen_random_uuid()), full_name (text, NOT NULL),
 *   email (text, optional), phone_number (text, NOT NULL),
 *   program_of_study (text, NOT NULL), project_name (text, NOT NULL),
 *   project_explanation (text, NOT NULL), mvp_demo_url (text, NOT NULL),
 *   created_at (timestamptz, default: now())
 * Policy: exhibition_registrations_insert_public (INSERT for anon)
 * Storage: mvp-demos bucket (anon INSERT, anon SELECT) → mvp_demo_url
 */

import { NextResponse } from "next/server"
import { z } from "zod"
import { resolveSupabaseForRoute } from "@/lib/supabase/resolve-supabase-route"
import { uploadFormFile } from "@/lib/supabase/storage-upload"

const exhibitionFacilitatorFields = z.object({
  full_name: z.string().min(1),
  email: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().email().optional(),
  ),
  phone_number: z.string().min(1),
  program_of_study: z.string().min(1),
  project_name: z.string().min(1),
  project_explanation: z.string().min(1),
})

export async function POST(request: Request) {
  try {
    let formData: FormData
    try {
      formData = await request.formData()
    } catch {
      return NextResponse.json({ error: "Expected multipart/form-data" }, { status: 400 })
    }

    const getText = (key: string) => {
      const v = formData.get(key)
      return typeof v === "string" ? v.trim() : ""
    }

    const parsed = exhibitionFacilitatorFields.safeParse({
      full_name: getText("full_name"),
      email: getText("email") || undefined,
      phone_number: getText("phone_number"),
      program_of_study: getText("program_of_study"),
      project_name: getText("project_name"),
      project_explanation: getText("project_explanation"),
    })

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid exhibition registration", issues: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const mvpEntry = formData.get("mvp_demo")

    if (!(mvpEntry instanceof File) || mvpEntry.size === 0) {
      return NextResponse.json({ error: "MVP / demo file is required" }, { status: 400 })
    }

    const mvpFile = mvpEntry

    const supabase = await resolveSupabaseForRoute()
    const up = await uploadFormFile({
      supabase,
      bucket: "mvp-demos",
      file: mvpFile,
      folder: "exhibition",
      kind: "mvp",
    })

    if ("error" in up) {
      return NextResponse.json({ error: "MVP upload failed", details: up.error }, { status: 400 })
    }

    const emailVal = parsed.data.email

    const { error } = await supabase.from("exhibition_registrations").insert({
      full_name: parsed.data.full_name.trim(),
      email: emailVal?.trim() ? emailVal.trim() : null,
      phone_number: parsed.data.phone_number.trim(),
      program_of_study: parsed.data.program_of_study.trim(),
      project_name: parsed.data.project_name.trim(),
      project_explanation: parsed.data.project_explanation.trim(),
      mvp_demo_url: up.publicUrl,
    })

    if (error) {
      console.error("exhibition_registrations insert failed:", error.message)
      return NextResponse.json(
        { error: "Could not save registration", details: error.message },
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
