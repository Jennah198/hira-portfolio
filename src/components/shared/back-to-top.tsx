"use client"

import { ArrowUp } from "lucide-react"

export function BackToTop({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="group inline-flex items-center gap-2 rounded-full border glass-subtle px-4 py-2 text-xs font-medium transition-colors hover:text-gold"
    >
      <ArrowUp aria-hidden className="size-3.5 transition-transform group-hover:-translate-y-0.5" />
      {label}
    </button>
  )
}
