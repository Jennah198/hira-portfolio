/**
 * TABLE: public.exhibition_guest_registrations (admin read-only, newest first)
 */
import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-auth"
import { createServiceRoleClient } from "@/lib/supabase/service"

export async function GET() {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  const supabase = createServiceRoleClient()
  if (!supabase) {
    return NextResponse.json({ error: "Missing Supabase configuration" }, { status: 500 })
  }

  const { data, error } = await supabase
    .from("exhibition_guest_registrations")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ data })
}
