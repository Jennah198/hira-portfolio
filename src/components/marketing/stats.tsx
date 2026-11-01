"use client"

import { useEffect, useRef, useState } from "react"
import { useI18n } from "@/i18n/client"
import { localeMeta } from "@/i18n/config"
import { cn } from "@/lib/utils"

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const { locale } = useI18n()
  const ref = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState(value)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let frame = 0
    let started = false
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return
        started = true
        io.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / 1600)
          setShown(Math.round(value * (1 - Math.pow(1 - p, 3))))
          if (p < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value])

  return (
    <span ref={ref} className="tabular-nums">
      {new Intl.NumberFormat(localeMeta[locale].intl).format(shown)}
      {suffix}
    </span>
  )
}

export function ImpactStats({ className }: { className?: string }) {
  const { t } = useI18n()
  const stats = [
    { value: 500, suffix: "+", label: t.stats.graduates },
    { value: 15, suffix: "+", label: t.stats.projects },
    { value: 6, suffix: "+", label: t.stats.years },
    { value: 6, suffix: "", label: t.stats.programmes },
  ]
  return (
    <div className={cn("grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6", className)}>
      {stats.map((s, i) => (
        <div
          key={s.label}
          data-reveal
          style={{ ["--reveal-delay" as string]: `${i * 90}ms` }}
          className="glass rounded-2xl border p-6 text-center md:p-8"
        >
          <div className="text-4xl font-semibold tracking-tight text-gold md:text-5xl">
            <Counter value={s.value} suffix={s.suffix} />
          </div>
          <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
        </div>
      ))}
    </div>
  )
}
