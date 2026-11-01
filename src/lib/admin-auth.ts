import { createHmac, timingSafeEqual } from "node:crypto"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

/**
 * Server-side auth for the password-protected submissions dashboard (/admin).
 *
 * The password lives only on the server (ADMIN_PASSWORD). On successful login we set an
 * httpOnly cookie holding `<expiresAt>.<hmac>`; every /api/admin/* route verifies it.
 */

export const ADMIN_COOKIE = "hira_admin_session"
const SESSION_TTL_SECONDS = 60 * 60 * 8 // 8 hours

function getAdminPassword(): string {
  // Server-only. Never expose this via a NEXT_PUBLIC_ variable (those are bundled into the browser).
  return process.env.ADMIN_PASSWORD ?? ""
}

function getSigningSecret(): string {
  // Dedicated secret preferred; otherwise derive from password so rotating it invalidates sessions.
  return process.env.ADMIN_SESSION_SECRET || `hira-admin:${getAdminPassword()}`
}

function sign(value: string): string {
  return createHmac("sha256", getSigningSecret()).update(value).digest("hex")
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  return ab.length === bb.length && timingSafeEqual(ab, bb)
}

export function isAdminPasswordConfigured(): boolean {
  return getAdminPassword().length > 0
}

export function checkAdminPassword(input: string): boolean {
  const expected = getAdminPassword()
  if (!expected) return false
  // Compare HMACs so lengths always match and the comparison is constant-time.
  return safeEqual(sign(`pw:${input}`), sign(`pw:${expected}`))
}

export function createSessionToken(): { token: string; maxAge: number } {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS
  return { token: `${expiresAt}.${sign(String(expiresAt))}`, maxAge: SESSION_TTL_SECONDS }
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token || !isAdminPasswordConfigured()) return false
  const [exp, mac] = token.split(".")
  if (!exp || !mac || !/^\d+$/.test(exp)) return false
  if (Number(exp) < Math.floor(Date.now() / 1000)) return false
  return safeEqual(mac, sign(exp))
}

/** Returns a 401 response if the request has no valid admin session, otherwise null. */
export async function requireAdmin(): Promise<NextResponse | null> {
  const store = await cookies()
  if (verifySessionToken(store.get(ADMIN_COOKIE)?.value)) return null
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}
