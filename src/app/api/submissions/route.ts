import { NextResponse } from "next/server"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { createServiceRoleClient } from "@/lib/supabase/service"

type SubmissionBody = {
  type: string
  payload: unknown
}

const membershipApplicationPayload = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  studentId: z.string().min(1),
  program: z.string().min(1),
  year: z.string().min(1),
  motivation: z.string().min(1),
  areaOfInterest: z.string().min(1),
})

async function persistMembershipApplication(payload: z.infer<typeof membershipApplicationPayload>) {
  const row = {
    full_name: payload.fullName.trim(),
    email: payload.email.trim(),
    phone: payload.phone.trim(),
    student_id: payload.studentId.trim(),
    program: payload.program.trim(),
    year: payload.year.trim(),
    motivation: payload.motivation.trim(),
    area_of_interest: payload.areaOfInterest.trim(),
  }

  const service = createServiceRoleClient()
  const supabase = service ?? (await createClient())

  const { error } = await supabase.from("membership").insert(row)

  if (error) {
    return error
  }
  return null
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SubmissionBody

    if (!body?.type || !body?.payload) {
      return NextResponse.json({ error: "Missing type or payload" }, { status: 400 })
    }

    if (body.type === "membership-application") {
      const parsed = membershipApplicationPayload.safeParse(body.payload)

      if (!parsed.success) {
        return NextResponse.json(
          { error: "Invalid membership application payload", issues: parsed.error.flatten() },
          { status: 400 },
        )
      }

      const dbError = await persistMembershipApplication(parsed.data)

      if (dbError) {
        console.error("Supabase membership insert failed:", dbError.message)
        return NextResponse.json(
          {
            error: "Could not save application",
            details: dbError.message,
          },
          { status: 500 },
        )
      }
    }

    const webhookUrl = process.env.SUBMISSION_WEBHOOK_URL
    const webhookToken = process.env.SUBMISSION_WEBHOOK_TOKEN

    if (webhookUrl) {
      const webhookResponse = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(webhookToken ? { Authorization: `Bearer ${webhookToken}` } : {}),
        },
        body: JSON.stringify({
          submittedAt: new Date().toISOString(),
          ...body,
        }),
      })

      if (!webhookResponse.ok) {
        return NextResponse.json({ error: "Webhook rejected submission" }, { status: 502 })
      }
    } else if (body.type !== "membership-application") {
      console.log("Submission received:", JSON.stringify(body))
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
