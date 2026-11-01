/**
 * TABLE: public.graduation_registrations
 * Columns: id (uuid, PK, default: gen_random_uuid()), full_name (text, NOT NULL),
 *   school_name (text, NOT NULL), phone_number (text, NOT NULL),
 *   telegram_username (text, NOT NULL), id_card_number (text, optional),
 *   email (text, optional), address (text, NOT NULL),
 *   payment_receipt_url (text, NOT NULL — receipt upload is required), created_at (timestamptz, default: now())
 * Policy: graduation_registrations_insert_public (INSERT for anon)
 * Storage: private receipts bucket (service role upload) → payment_receipt_url (required)
 */

import { NextResponse } from "next/server"
import { z } from "zod"
import { resolveSupabaseForRoute } from "@/lib/supabase/resolve-supabase-route"
import { uploadFormFile } from "@/lib/supabase/storage-upload"
import { isBot } from "@/lib/honeypot"

const graduationFields = z.object({
  full_name: z.string().min(1).max(300),
  school_name: z.string().min(1).max(300),
  phone_number: z.string().min(1).max(60),
  telegram_username: z.string().min(1).max(60),
  id_card_number: z.string().max(60).optional(),
  email: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.email().max(254).optional(),
  ),
  address: z.string().min(1).max(300),
})

function normalizeTelegram(raw: string): string {
  return raw.trim().replace(/^@+/, "")
}

export async function POST(request: Request) {
  try {
    let formData: FormData
    try {
      formData = await request.formData()
    } catch {
      return NextResponse.json({ error: "Expected multipart/form-data" }, { status: 400 })
    }

    if (isBot(formData.get("website"))) {
      return NextResponse.json({ ok: true })
    }

    const getText = (key: string) => {
      const v = formData.get(key)
      return typeof v === "string" ? v.trim() : ""
    }

    const parsed = graduationFields.safeParse({
      full_name: getText("full_name"),
      school_name: getText("school_name"),
      phone_number: getText("phone_number"),
      telegram_username: getText("telegram_username"),
      id_card_number: getText("id_card_number") || undefined,
      email: getText("email") || undefined,
      address: getText("address"),
    })

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid graduation registration", issues: z.flattenError(parsed.error) },
        { status: 400 },
      )
    }

    const receiptEntry = formData.get("receipt")
    if (!(receiptEntry instanceof File) || receiptEntry.size === 0) {
      return NextResponse.json({ error: "Payment receipt is required" }, { status: 400 })
    }

    const supabase = await resolveSupabaseForRoute()
    const up = await uploadFormFile({
      supabase,
      bucket: "receipts",
      file: receiptEntry,
      folder: "graduation",
      kind: "receipt",
    })
    if ("error" in up) {
      return NextResponse.json({ error: "Receipt upload failed", details: up.error }, { status: 400 })
    }
    const paymentReceiptUrl = up.path

    const emailVal = parsed.data.email

    const { error } = await supabase.from("graduation_registrations").insert({
      full_name: parsed.data.full_name.trim(),
      school_name: parsed.data.school_name.trim(),
      phone_number: parsed.data.phone_number.trim(),
      telegram_username: normalizeTelegram(parsed.data.telegram_username),
      id_card_number: parsed.data.id_card_number?.trim() || null,
      email: emailVal?.trim() ? emailVal.trim() : null,
      address: parsed.data.address.trim(),
      payment_receipt_url: paymentReceiptUrl,
    })

    if (error) {
      console.error("graduation_registrations insert failed:", error.message)
      return NextResponse.json(
        { error: "Could not save registration" },
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
