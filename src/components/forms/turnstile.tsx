"use client"

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"

/**
 * Cloudflare Turnstile widget. "interaction-only": invisible for almost everyone; a checkbox
 * appears only if Cloudflare is unsure. Renders nothing if NEXT_PUBLIC_TURNSTILE_SITE_KEY is unset.
 */
export type TurnstileHandle = {
  /** Resolves with a fresh token (waits briefly for the widget), or undefined if disabled/failed. */
  getToken: () => Promise<string | undefined>
  /** Tokens are single-use: call after each submission. */
  reset: () => void
}

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string
  reset: (id: string) => void
  remove: (id: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
let scriptPromise: Promise<void> | null = null

function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve()
  scriptPromise ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement("script")
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
    s.async = true
    s.defer = true
    s.onload = () => resolve()
    s.onerror = () => {
      scriptPromise = null
      reject(new Error("Turnstile failed to load"))
    }
    document.head.appendChild(s)
  })
  return scriptPromise
}

export const Turnstile = forwardRef<TurnstileHandle>(function Turnstile(_props, ref) {
  const container = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)
  const token = useRef<string | undefined>(undefined)
  const waiters = useRef<Array<(t: string | undefined) => void>>([])

  useEffect(() => {
    if (!SITE_KEY) return
    let cancelled = false
    const flush = (t: string | undefined) => waiters.current.splice(0).forEach((resolve) => resolve(t))
    loadScript()
      .then(() => {
        if (cancelled || !container.current || !window.turnstile) return
        widgetId.current = window.turnstile.render(container.current, {
          sitekey: SITE_KEY,
          appearance: "interaction-only",
          theme: "auto",
          language: "auto",
          callback: (t: string) => {
            token.current = t
            flush(t)
          },
          "expired-callback": () => {
            token.current = undefined
          },
          "error-callback": () => {
            token.current = undefined
            flush(undefined)
          },
        })
      })
      .catch(() => flush(undefined))
    return () => {
      cancelled = true
      if (widgetId.current) window.turnstile?.remove(widgetId.current)
      widgetId.current = null
    }
  }, [])

  useImperativeHandle(ref, () => ({
    getToken: () => {
      if (!SITE_KEY) return Promise.resolve(undefined)
      if (token.current) return Promise.resolve(token.current)
      return new Promise((resolve) => {
        waiters.current.push(resolve)
        window.setTimeout(() => resolve(token.current), 20000)
      })
    },
    reset: () => {
      token.current = undefined
      if (widgetId.current) window.turnstile?.reset(widgetId.current)
    },
  }))

  if (!SITE_KEY) return null
  return <div ref={container} className="flex justify-center" />
})
