/**
 * JSON submissions:
 *  - type "membership-application"   → public.membership
 *  - type "exhibition-guest-company"  → public.exhibition_guest_registrations
 *    (id uuid PK, company_name, owner_full_name, email?, phone_number, business_type,
 *     area_of_interest, created_at) — see scripts/005_exhibition_guest_registrations.sql
 * Optionally forwards every accepted submission to SUBMISSION_WEBHOOK_URL.
 */

import { NextResponse } from "next/server"
import { z } from "zod"
import { resolveSupabaseForRoute } from "@/lib/supabase/resolve-supabase-route"
import { isBot } from "@/lib/honeypot"

const MAX_BODY_BYTES = 50_000

const text = (max: number) => z.string().trim().min(1).max(max)
const email = z.string().trim().max(254).pipe(z.email())
const optionalEmail = z
  .string()
  .trim()
  .max(254)
  .transform((v) => (v === "" ? undefined : v))
  .pipe(z.email().optional())
  .optional()

const membershipPayload = z.object({
  fullName: text(200),
  email,
  phone: text(40),
  studentId: text(100),
  program: text(200),
  year: text(100),
  motivation: text(5000),
  areaOfInterest: text(100),
})

const guestCompanyPayload = z.object({
  companyName: text(200),
  ownerFullName: text(200),
  email: optionalEmail,
  phone: text(40),
  businessType: text(200),
  interestedArea: text(2000),
})

const submissionBody = z.object({
  type: z.string().min(1).max(100),
  payload: z.unknown(),
  website: z.unknown().optional(),
})

type Handler = (payload: unknown) => Promise<NextResponse | null>

const handlers: Record<string, Handler> = {
  "membership-application": async (payload) => {
    const parsed = membershipPayload.safeParse(payload)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid membership application", issues: z.flattenError(parsed.error) },
        { status: 400 },
      )
    }
    const d = parsed.data
    const supabase = await resolveSupabaseForRoute()
    const { error } = await supabase.from("membership").insert({
      full_name: d.fullName,
      email: d.email,
      phone: d.phone,
      student_id: d.studentId,
      program: d.program,
      year: d.year,
      motivation: d.motivation,
      area_of_interest: d.areaOfInterest,
    })
    if (error) {
      console.error("membership insert failed:", error.message)
      return NextResponse.json({ error: "Could not save application" }, { status: 500 })
    }
    return null
  },

  "exhibition-guest-company": async (payload) => {
    const parsed = guestCompanyPayload.safeParse(payload)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid guest registration", issues: z.flattenError(parsed.error) },
        { status: 400 },
      )
    }
    const d = parsed.data
    const supabase = await resolveSupabaseForRoute()
    const { error } = await supabase.from("exhibition_guest_registrations").insert({
      company_name: d.companyName,
      owner_full_name: d.ownerFullName,
      email: d.email ?? null,
      phone_number: d.phone,
      business_type: d.businessType,
      area_of_interest: d.interestedArea,
    })
    if (error) {
      console.error("exhibition_guest_registrations insert failed:", error.message)
      return NextResponse.json({ error: "Could not save registration" }, { status: 500 })
    }
    return null
  },
}

export async function POST(request: Request) {
  try {
    const raw = await request.text()
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Submission is too large" }, { status: 413 })
    }

    let json: unknown
    try {
      json = JSON.parse(raw)
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
    }

    const body = submissionBody.safeParse(json)
    if (!body.success) {
      return NextResponse.json({ error: "Missing type or payload" }, { status: 400 })
    }
    if (isBot(body.data.website)) {
      return NextResponse.json({ ok: true })
    }

    const handler = handlers[body.data.type]
    if (!handler) {
      return NextResponse.json({ error: "Unknown submission type" }, { status: 400 })
    }

    const failure = await handler(body.data.payload)
    if (failure) return failure

    const webhookUrl = process.env.SUBMISSION_WEBHOOK_URL
    if (webhookUrl) {
      const webhookToken = process.env.SUBMISSION_WEBHOOK_TOKEN
      // Saved already; a webhook outage must not fail the user's submission.
      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(webhookToken ? { Authorization: `Bearer ${webhookToken}` } : {}),
        },
        body: JSON.stringify({ submittedAt: new Date().toISOString(), type: body.data.type, payload: body.data.payload }),
        signal: AbortSignal.timeout(5000),
      }).catch((err) => console.error("Submission webhook failed:", err))
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("submissions error:", error)
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 })
  }
}
