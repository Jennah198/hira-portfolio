/**
 * TABLE: public.graduation_registrations
 * Columns: id (uuid, PK, default: gen_random_uuid()), full_name (text, NOT NULL),
 *   school_name (text, NOT NULL), phone_number (text, NOT NULL),
 *   telegram_username (text, NOT NULL), id_card_number (text, optional),
 *   email (text, optional), address (text, NOT NULL),
 *   payment_receipt_url (text, NOT NULL — storage path in the private "receipts" bucket), created_at
 * The receipt is uploaded by the browser directly to Supabase (see /api/uploads); this route
 * receives JSON with the object path and a signed ticket.
 */

import { NextResponse } from "next/server"
import { z } from "zod"
import { resolveSupabaseForRoute } from "@/lib/supabase/resolve-supabase-route"
import { isBot } from "@/lib/honeypot"
import { confirmUploaded, verifyTicket } from "@/lib/uploads"
import { notifySubmission } from "@/lib/notify"

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : null))

const graduationBody = z.object({
  full_name: z.string().trim().min(1).max(300),
  school_name: z.string().trim().min(1).max(300),
  phone_number: z.string().trim().min(1).max(60),
  telegram_username: z.string().trim().min(1).max(60),
  id_card_number: optionalText(60),
  email: z
    .string()
    .trim()
    .max(254)
    .optional()
    .transform((v) => (v ? v : undefined))
    .pipe(z.email().optional()),
  address: z.string().trim().min(1).max(300),
  receipt_path: z.string().max(200),
  receipt_ticket: z.string().max(200),
  website: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const json = await request.json().catch(() => null)
    if (json && isBot((json as { website?: unknown }).website)) {
      return NextResponse.json({ ok: true })
    }

    const parsed = graduationBody.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid graduation registration", issues: z.flattenError(parsed.error) },
        { status: 400 },
      )
    }
    const d = parsed.data

    if (!verifyTicket("receipt", d.receipt_path, d.receipt_ticket)) {
      return NextResponse.json({ error: "Payment receipt is required" }, { status: 400 })
    }

    const supabase = await resolveSupabaseForRoute()
    if (!(await confirmUploaded(supabase, "receipt", d.receipt_path))) {
      return NextResponse.json({ error: "Payment receipt upload was not found. Please upload it again." }, { status: 400 })
    }

    const { error } = await supabase.from("graduation_registrations").insert({
      full_name: d.full_name,
      school_name: d.school_name,
      phone_number: d.phone_number,
      telegram_username: d.telegram_username.replace(/^@+/, ""),
      id_card_number: d.id_card_number,
      email: d.email ?? null,
      address: d.address,
      payment_receipt_url: d.receipt_path,
    })

    if (error) {
      console.error("graduation_registrations insert failed:", error.message)
      return NextResponse.json({ error: "Could not save registration" }, { status: 500 })
    }

    notifySubmission("graduation registration", { Name: d.full_name, School: d.school_name, Phone: d.phone_number })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[/api/graduation]", error)
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 })
  }
}
