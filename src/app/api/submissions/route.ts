import { NextResponse } from "next/server"

type SubmissionBody = {
  type: string
  payload: unknown
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SubmissionBody

    if (!body?.type || !body?.payload) {
      return NextResponse.json({ error: "Missing type or payload" }, { status: 400 })
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
    } else {
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
