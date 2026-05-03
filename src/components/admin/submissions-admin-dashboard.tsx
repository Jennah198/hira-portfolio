"use client"

import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const AUTH_KEY = "hira-admin-submissions-auth"

type TabId = "membership" | "contact" | "graduation" | "exhibition"

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
          className="text-emerald-400 underline underline-offset-2 break-all hover:text-emerald-300"
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
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? ""

  const [hydrated, setHydrated] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")
  const [authError, setAuthError] = useState<string | null>(null)

  const [tab, setTab] = useState<TabId>("membership")
  const [rows, setRows] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    setHydrated(true)
    setAuthenticated(sessionStorage.getItem(AUTH_KEY) === "1")
  }, [])

  const activeConfig = TABS.find((t) => t.id === tab)!

  const loadData = useCallback(async () => {
    setLoading(true)
    setFetchError(null)
    try {
      const res = await fetch(activeConfig.endpoint, { method: "GET" })
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
    void loadData()
  }, [hydrated, authenticated, tab, loadData])

  function handleLogin(e: FormEvent) {
    e.preventDefault()
    setAuthError(null)
    if (!adminPassword) {
      setAuthError("Admin password is not configured (NEXT_PUBLIC_ADMIN_PASSWORD).")
      return
    }
    if (passwordInput !== adminPassword) {
      setAuthError("Incorrect password.")
      return
    }
    sessionStorage.setItem(AUTH_KEY, "1")
    setAuthenticated(true)
    setPasswordInput("")
  }

  function handleLogout() {
    sessionStorage.removeItem(AUTH_KEY)
    setAuthenticated(false)
    setRows([])
    setFetchError(null)
  }

  if (!hydrated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-zinc-950 text-zinc-100 px-4">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-zinc-950 px-4 py-12">
        <Card className="w-full max-w-md border-zinc-800 bg-zinc-900 text-zinc-100 shadow-xl">
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
                  className="bg-zinc-950 border-zinc-700"
                />
              </div>
              {authError != null ? <p className="text-sm text-red-400">{authError}</p> : null}
              <Button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-600">
                Unlock dashboard
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 sticky top-0 z-40 bg-zinc-950/95 backdrop-blur">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Submission records</h1>
            <p className="text-xs text-muted-foreground">Read-only view · ordered by newest first</p>
          </div>
          <Button variant="outline" size="sm" className="border-zinc-600 bg-transparent" onClick={handleLogout}>
            Log out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-wrap gap-2 border-b border-zinc-800 pb-4">
          {TABS.map((t) => (
            <Button
              key={t.id}
              type="button"
              variant={tab === t.id ? "default" : "outline"}
              size="sm"
              className={
                tab === t.id ? "bg-emerald-700 hover:bg-emerald-600" : "border-zinc-700 bg-transparent"
              }
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
          <div className="rounded-lg border border-red-900 bg-red-950/50 px-4 py-3 text-sm text-red-200">
            {fetchError}
          </div>
        ) : null}

        {loading && rows.length === 0 ? (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-12 text-center text-muted-foreground text-sm">
            Loading submissions…
          </div>
        ) : rows.length === 0 ? (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-12 text-center text-muted-foreground text-sm">
            No submissions yet.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-zinc-800 shadow-lg">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-900 text-zinc-300">
                <tr>
                  {activeConfig.columns.map((col) => (
                    <th key={col} className="whitespace-nowrap border-b border-zinc-800 px-3 py-3 font-semibold capitalize">
                      {col.replace(/_/g, " ")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 bg-zinc-950">
                {rows.map((row) => (
                  <tr key={String(row.id ?? JSON.stringify(row))} className="hover:bg-zinc-900/50">
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
