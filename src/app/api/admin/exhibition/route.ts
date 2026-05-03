/**
 * TABLE: public.exhibition_registrations
 * GET handler: Fetches all rows, generates signed URLs for mvp_demo_url
 * Signed URL expiry: 1 hour
 * Storage: mvp-demos bucket (private, uses service role for signed URL generation)
 */

import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { signedUrlOrOriginal } from "@/lib/supabase/storage-signed-url"

const MVP_BUCKET = "mvp-demos"

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    return NextResponse.json({ error: "Missing Supabase configuration" }, { status: 500 })
  }

  const supabase = createClient(url, serviceKey)
  const { data, error } = await supabase
    .from("exhibition_registrations")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const rows = data ?? []
  const withSigned = await Promise.all(
    rows.map(async (row) => {
      const copy = { ...row } as Record<string, unknown>
      const mvp = copy.mvp_demo_url
      if (typeof mvp === "string" && mvp.trim()) {
        copy.mvp_demo_url = await signedUrlOrOriginal(supabase, MVP_BUCKET, mvp, 3600)
      }
      return copy
    }),
  )

  return NextResponse.json({ data: withSigned })
}
