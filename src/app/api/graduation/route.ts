/**
 * TABLE: public.graduation_registrations
 * Columns: id (uuid, PK, default: gen_random_uuid()), full_name (text, NOT NULL),
 *   school_name (text, NOT NULL), phone_number (text, NOT NULL),
 *   telegram_username (text, NOT NULL), id_card_number (text, optional),
 *   email (text, optional), address (text, NOT NULL),
 *   payment_receipt_url (text, NOT NULL), created_at (timestamptz, default: now())
 * Policy: graduation_registrations_insert_public (INSERT for anon)
 * Storage: receipts bucket (anon INSERT, anon SELECT) → payment_receipt_url
 */

import { NextResponse } from "next/server"
import { z } from "zod"
import { resolveSupabaseForRoute } from "@/lib/supabase/resolve-supabase-route"
import { uploadFormFile } from "@/lib/supabase/storage-upload"

const graduationFields = z.object({
  full_name: z.string().min(1),
  school_name: z.string().min(1),
  phone_number: z.string().min(1),
  telegram_username: z.string().min(1),
  id_card_number: z.string().optional(),
  email: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().email().optional(),
  ),
  address: z.string().min(1),
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
        { error: "Invalid graduation registration", issues: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const supabase = await resolveSupabaseForRoute()

    const receiptEntry = formData.get("receipt")
    let paymentReceiptUrl: string | null = null

    if (receiptEntry instanceof File && receiptEntry.size > 0) {
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
      paymentReceiptUrl = up.path
    } else if (receiptEntry !== null && !(receiptEntry instanceof File)) {
      return NextResponse.json({ error: "Invalid receipt file" }, { status: 400 })
    }

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
