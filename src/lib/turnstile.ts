import { NextResponse } from "next/server"

/**
 * Cloudflare Turnstile (spam protection). Enabled when TURNSTILE_SECRET_KEY is set;
 * without it (local dev) verification is skipped so forms keep working.
 * Test keys: site 1x00000000000000000000AA / secret 1x0000000000000000000000000000000AA (always pass).
 */
const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

export async function verifyTurnstile(token: unknown, ip: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true
  if (typeof token !== "string" || token.length === 0 || token.length > 2048) return false

  const body = new URLSearchParams({ secret, response: token })
  if (ip) body.set("remoteip", ip)
  try {
    const res = await fetch(VERIFY_URL, { method: "POST", body, signal: AbortSignal.timeout(5000) })
    const data = (await res.json()) as { success?: boolean }
    return data.success === true
  } catch (err) {
    console.error("Turnstile verification error:", err)
    return false
  }
}

export function clientIp(request: Request): string | null {
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    null
  )
}

/** 403 with a machine-readable code so the browser can show a translated message. */
export function captchaFailed() {
  return NextResponse.json({ error: "Security check failed. Please try again.", code: "captcha" }, { status: 403 })
}
