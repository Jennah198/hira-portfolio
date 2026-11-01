/**
 * Admin dashboard session.
 * POST   { password } → sets httpOnly session cookie
 * GET    → { authenticated: boolean }
 * DELETE → clears the cookie (logout)
 */

import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import {
  ADMIN_COOKIE,
  checkAdminPassword,
  createSessionToken,
  isAdminPasswordConfigured,
  verifySessionToken,
} from "@/lib/admin-auth"

export async function GET() {
  const store = await cookies()
  return NextResponse.json({ authenticated: verifySessionToken(store.get(ADMIN_COOKIE)?.value) })
}

export async function POST(request: Request) {
  if (!isAdminPasswordConfigured()) {
    return NextResponse.json({ error: "Admin password is not configured (ADMIN_PASSWORD)." }, { status: 500 })
  }

  const body = (await request.json().catch(() => null)) as { password?: unknown } | null
  const password = typeof body?.password === "string" ? body.password : ""

  if (!checkAdminPassword(password)) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 })
  }

  const { token, maxAge } = createSessionToken()
  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete(ADMIN_COOKIE)
  return res
}
