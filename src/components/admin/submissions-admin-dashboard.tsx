"use client"

import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ArrowBack } from "@/components/shared/accent"

type TabId = "membership" | "contact" | "graduation" | "exhibition" | "exhibition-guests"

const TABS: {
  id: TabId
  label: string
  endpoint: string
  columns: string[]
}[] = [
  {
    id: "membership",
    label: "Membership",
    endpoint: "/api/admin/membership",
    columns: [
      "id",
      "full_name",
      "email",
      "phone",
      "student_id",
      "program",
      "year",
      "motivation",
      "area_of_interest",
      "created_at",
    ],
  },
  {
    id: "contact",
    label: "Contact",
    endpoint: "/api/admin/contact",
    columns: ["id", "name", "email", "message", "created_at"],
  },
  {
    id: "graduation",
    label: "Graduation",
    endpoint: "/api/admin/graduation",
    columns: [
      "id",
      "full_name",
      "school_name",
      "phone_number",
      "telegram_username",
      "id_card_number",
      "email",
      "address",
      "payment_receipt_url",
      "created_at",
    ],
  },
  {
    id: "exhibition",
    label: "Exhibition",
    endpoint: "/api/admin/exhibition",
    columns: [
      "id",
      "full_name",
      "email",
      "phone_number",
      "program_of_study",
      "project_name",
      "project_explanation",
      "mvp_demo_url",
      "created_at",
    ],
  },
  {
    id: "exhibition-guests",
    label: "Exhibition guests",
    endpoint: "/api/admin/exhibition-guests",
    columns: [
      "id",
      "company_name",
      "owner_full_name",
      "email",
      "phone_number",
      "business_type",
      "area_of_interest",
      "created_at",
    ],
  },
]

function formatCell(columnKey: string, value: unknown): ReactNode {
  if (value === null || value === undefined || value === "") {
    return <span className="text-muted-foreground">—</span>
  }

  if (columnKey.includes("_url") && typeof value === "string") {
    const trimmed = value.trim()
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return (
        <a
          href={trimmed}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold underline underline-offset-2 break-all hover:opacity-80"
        >
          Open link
        </a>
      )
    }
  }

  if (columnKey === "created_at" && typeof value === "string") {
    const d = new Date(value)
    return Number.isNaN(d.getTime()) ? value : d.toLocaleString()
  }

  if (typeof value === "object") {
    return <span className="font-mono text-xs">{JSON.stringify(value)}</span>
  }

  return String(value)
}

export function SubmissionsAdminDashboard() {
  const [hydrated, setHydrated] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")
  const [authError, setAuthError] = useState<string | null>(null)

  const [tab, setTab] = useState<TabId>("membership")
  const [rows, setRows] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const [loggingIn, setLoggingIn] = useState(false)

  useEffect(() => {
    // Session lives in an httpOnly cookie; ask the server whether it is still valid.
    fetch("/api/admin/session")
      .then((r) => r.json() as Promise<{ authenticated?: boolean }>)
      .then((b) => setAuthenticated(Boolean(b.authenticated)))
      .catch(() => setAuthenticated(false))
      .finally(() => setHydrated(true))
  }, [])

  const activeConfig = TABS.find((t) => t.id === tab)!

  const loadData = useCallback(async () => {
    setLoading(true)
    setFetchError(null)
    try {
      const res = await fetch(activeConfig.endpoint, { method: "GET" })
      if (res.status === 401) {
        setAuthenticated(false)
        setRows([])
        return
      }
      const body = (await res.json()) as { data?: Record<string, unknown>[]; error?: string }

      if (!res.ok || body.error) {
        setFetchError(body.error ?? `Request failed (${res.status})`)
        setRows([])
        return
      }

      setRows(Array.isArray(body.data) ? body.data : [])
    } catch (e) {
      setFetchError(e instanceof Error ? e.message : "Network error")
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [activeConfig.endpoint])

  useEffect(() => {
    if (!hydrated || !authenticated) return
    // Fetching on tab/auth change is the intended external sync here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadData()
  }, [hydrated, authenticated, tab, loadData])

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    setAuthError(null)
    setLoggingIn(true)
    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput }),
      })
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null
        setAuthError(body?.error ?? `Login failed (${res.status})`)
        return
      }
      setAuthenticated(true)
      setPasswordInput("")
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Network error")
    } finally {
      setLoggingIn(false)
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/session", { method: "DELETE" }).catch(() => undefined)
    setAuthenticated(false)
    setRows([])
    setFetchError(null)
  }

  if (!hydrated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4 py-12">
        <Button asChild variant="outline" size="sm">
          <Link href="/">
            <ArrowBack />
            Back to Home
          </Link>
        </Button>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-xl tracking-tight">Submissions Admin</CardTitle>
            <p className="text-sm text-muted-foreground">Enter the dashboard password to continue.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                                  />
              </div>
              {authError != null ? <p className="text-sm text-destructive">{authError}</p> : null}
              <Button type="submit" className="w-full" disabled={loggingIn}>
                {loggingIn ? "Checking…" : "Unlock dashboard"}
              </Button>
              <p className="text-xs text-muted-foreground text-center pt-2">
                Supabase-backed tools (posts, legacy registrations) still require login at separate routes if enabled.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-foreground">
      <header className="border-b sticky top-[72px] z-40 glass-strong">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/">
                <ArrowBack />
                Home
              </Link>
            </Button>
            <div>
            <h1 className="text-xl font-semibold tracking-tight">Submission records</h1>
            <p className="text-xs text-muted-foreground">Read-only view · ordered by newest first</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Log out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-wrap gap-2 border-b pb-4">
          {TABS.map((t) => (
            <Button
              key={t.id}
              type="button"
              variant={tab === t.id ? "default" : "outline"}
              size="sm"
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </Button>
          ))}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="ml-auto text-muted-foreground"
            onClick={() => void loadData()}
            disabled={loading}
          >
            {loading ? "Refreshing…" : "Refresh"}
          </Button>
        </div>

        {fetchError != null ? (
          <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {fetchError}
          </div>
        ) : null}

        {loading && rows.length === 0 ? (
          <div className="rounded-2xl border glass p-12 text-center text-muted-foreground text-sm">
            Loading submissions…
          </div>
        ) : rows.length === 0 ? (
          <div className="rounded-2xl border glass p-12 text-center text-muted-foreground text-sm">
            No submissions yet.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border glass">
            <table className="w-full text-left text-sm">
              <thead className="bg-foreground/[0.04] text-muted-foreground">
                <tr>
                  {activeConfig.columns.map((col) => (
                    <th key={col} className="whitespace-nowrap border-b px-3 py-3 font-semibold capitalize">
                      {col.replace(/_/g, " ")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((row) => (
                  <tr key={String(row.id ?? JSON.stringify(row))} className="hover:bg-foreground/[0.03] transition-colors">
                    {activeConfig.columns.map((col) => (
                      <td key={col} className="align-top whitespace-pre-wrap px-3 py-2 max-w-[min(28rem,calc(100vw-8rem))]">
                        {formatCell(col, row[col])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
