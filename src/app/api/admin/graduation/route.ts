/**
 * TABLE: public.graduation_registrations
 * GET handler: Fetches all rows, generates signed URLs for payment_receipt_url
 * Signed URL expiry: 1 hour
 * Storage: receipts bucket (private, uses service role for signed URL generation)
 */

import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { signedUrlOrOriginal } from "@/lib/supabase/storage-signed-url"

const RECEIPTS_BUCKET = "receipts"

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    return NextResponse.json({ error: "Missing Supabase configuration" }, { status: 500 })
  }

  const supabase = createClient(url, serviceKey)
  const { data, error } = await supabase
    .from("graduation_registrations")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const rows = data ?? []
  const withSigned = await Promise.all(
    rows.map(async (row) => {
      const copy = { ...row } as Record<string, unknown>
      const receipt = copy.payment_receipt_url
      if (typeof receipt === "string" && receipt.trim()) {
        copy.payment_receipt_url = await signedUrlOrOriginal(supabase, RECEIPTS_BUCKET, receipt, 3600)
      }
      return copy
    }),
  )

  return NextResponse.json({ data: withSigned })
}
