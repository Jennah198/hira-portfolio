import { after } from "next/server"
import { site } from "@/lib/site"

/**
 * Email alert for each new submission, sent via Resend (https://resend.com) after the response
 * so visitors never wait for it. Enabled when RESEND_API_KEY and ALERT_EMAIL_TO are set.
 * Deliberately contains only a minimal summary — full details stay in the admin dashboard.
 */
export function notifySubmission(kind: string, summary: Record<string, string | null | undefined>) {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.ALERT_EMAIL_TO
  if (!apiKey || !to) return

  after(async () => {
    const lines = Object.entries(summary)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}: ${v}`)
    const adminUrl = `${site.url}/admin`
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.ALERT_EMAIL_FROM || "Hira Website <onboarding@resend.dev>",
          to: to.split(",").map((s) => s.trim()).filter(Boolean),
          subject: `New ${kind} — Hira website`,
          text: [`A new ${kind} was submitted on the Hira website.`, "", ...lines, "", `View it in the admin dashboard: ${adminUrl}`].join("\n"),
        }),
        signal: AbortSignal.timeout(8000),
      })
      if (!res.ok) console.error("Alert email failed:", res.status, await res.text().catch(() => ""))
    } catch (err) {
      console.error("Alert email error:", err)
    }
  })
}
