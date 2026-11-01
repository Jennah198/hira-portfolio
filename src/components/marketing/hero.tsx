"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Award, BookOpen, GraduationCap, HandHeart, Moon, Play, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ArrowForward } from "@/components/shared/accent"
import { useI18n } from "@/i18n/client"
import { format } from "@/i18n/config"
import { cn } from "@/lib/utils"

const SLIDES = [
  { src: "/images/gradwithredgawn.webp", position: "50% 40%" },
  { src: "/images/graduationSisters.webp", position: "50% 42%" },
  { src: "/images/religiousStudies.webp", position: "50% 50%" },
  { src: "/images/exhibitionStands.webp", position: "50% 50%" },
]
const PILLAR_ICONS = [Moon, BookOpen, HandHeart, Award]
const INTERVAL_MS = 7000

export function Hero() {
  const { t } = useI18n()
  const [active, setActive] = useState(0)
  const [seen, setSeen] = useState(1)
  if (active + 1 > seen) setSeen(active + 1)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const id = window.setTimeout(() => setActive((a) => (a + 1) % SLIDES.length), INTERVAL_MS)
    return () => window.clearTimeout(id)
  }, [active])

  const pad = (n: number) => String(n).padStart(2, "0")

  return (
    <section className="relative isolate flex min-h-[min(100svh,1000px)] flex-col overflow-hidden text-white">
      {/* Background slideshow */}
      <div className="absolute inset-0 -z-30" data-parallax="0.25">
        {SLIDES.map((slide, i) =>
          // Only mount the current and next slide (plus any already seen) so the page
          // doesn't download every photo up front.
          i <= Math.max(active + 1, seen) ? (
          <Image
            key={slide.src}
            src={slide.src}
            style={{ objectPosition: slide.position }}
            alt={t.hero.slides[i] ?? ""}
            fill
            priority={i === 0}
            sizes="100vw"
            data-active={i === active}
            className="hero-slide object-cover"
          />
          ) : null,
        )}
      </div>
      <div className="photo-overlay absolute inset-0 -z-20" />
      <HeroRibbon />

      {/* Content */}
      <div className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-10 px-4 pb-10 pt-36 sm:px-6 md:pt-44 lg:grid-cols-[1.7fr_1fr] lg:px-8">
        <div>
          <p className="enter glass-photo inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium sm:text-sm">
            <Plus aria-hidden className="size-3.5" />
            {t.hero.eyebrow}
          </p>
          <h1
            className="enter mt-7 text-[2.75rem] font-semibold leading-[1.04] tracking-tight sm:text-6xl lg:text-[4rem] xl:text-[4.5rem]"
            style={{ ["--enter-delay" as string]: "120ms" }}
          >
            {t.hero.titleLine1}
            <br />
            <span className="text-gradient-hero">{t.hero.titleLine2}</span>
          </h1>
          <p
            className="enter mt-7 max-w-xl text-base leading-relaxed text-white/85 text-pretty md:text-lg"
            style={{ ["--enter-delay" as string]: "240ms" }}
          >
            {t.hero.subtitle}
          </p>
          <div className="enter mt-10 flex flex-wrap items-center gap-5" style={{ ["--enter-delay" as string]: "360ms" }}>
            <Button asChild size="lg" variant="hero">
              <Link href="/membership">
                {t.hero.primaryCta}
                <ArrowForward />
              </Link>
            </Button>
            <Link href="/our-work" className="group inline-flex items-center gap-3 text-sm font-medium text-white/90 hover:text-white">
              <span className="glass-photo inline-flex size-12 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110">
                <Play aria-hidden className="size-4 fill-current" />
              </span>
              {t.hero.secondaryCta}
            </Link>
          </div>
        </div>

        {/* Floating glass card */}
        <div className="enter hidden self-start justify-self-end pt-6 lg:block" style={{ ["--enter-delay" as string]: "500ms" }}>
          <Link
            href="/events/graduation/register"
            className="group/btn glass-photo flex max-w-sm items-center gap-4 rounded-2xl p-4 pe-5 transition-transform duration-300 hover:-translate-y-1"
          >
            <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-white/15">
              <GraduationCap aria-hidden className="size-5" />
            </span>
            <span>
              <span className="block font-semibold">{t.hero.cardTitle}</span>
              <span className="mt-0.5 block text-sm leading-snug text-white/75">{t.hero.cardText}</span>
            </span>
            <span className="ms-auto inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-white/15">
              <ArrowForward />
            </span>
          </Link>
        </div>
      </div>

      {/* Pillars strip + slide indicator */}
      <div className="mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="enter flex flex-col gap-6 border-t border-white/15 pt-6 md:flex-row md:items-center md:justify-between" style={{ ["--enter-delay" as string]: "600ms" }}>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-4 md:flex md:gap-8">
            {t.pillars.map((p, i) => {
              const Icon = PILLAR_ICONS[i] ?? Award
              return (
                <li key={p.title} className="flex items-center gap-3">
                  <span className="glass-photo inline-flex size-10 shrink-0 items-center justify-center rounded-full">
                    <Icon aria-hidden className="size-4" />
                  </span>
                  <span className="leading-tight">
                    <span className="block text-sm font-semibold">{p.title}</span>
                    <span className="block text-xs text-white/65">{p.text}</span>
                  </span>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-3 text-xs tabular-nums text-white/80" dir="ltr">
            <span>{pad(active + 1)}</span>
            <div className="flex items-center gap-1.5">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={format(t.common.goToSlide, { n: i + 1 })}
                  aria-current={i === active}
                  onClick={() => setActive(i)}
                  className="group py-2"
                >
                  <span
                    className={cn(
                      "block h-0.5 rounded-full transition-all duration-500",
                      i === active ? "w-12 bg-white" : "w-5 bg-white/35 group-hover:bg-white/70",
                    )}
                  />
                </button>
              ))}
            </div>
            <span>{pad(SLIDES.length)}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Soft iridescent light ribbon sweeping across the hero (nod to the reference artwork). */
function HeroRibbon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      className="hero-ribbon pointer-events-none absolute inset-0 -z-10 h-full w-full"
    >
      <defs>
        <linearGradient id="ribbon-a" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="oklch(0.85 0.14 80)" stopOpacity="0" />
          <stop offset="0.35" stopColor="oklch(0.85 0.14 80)" stopOpacity="0.85" />
          <stop offset="0.6" stopColor="oklch(0.78 0.12 340)" stopOpacity="0.8" />
          <stop offset="0.85" stopColor="oklch(0.8 0.1 250)" stopOpacity="0.75" />
          <stop offset="1" stopColor="oklch(0.85 0.08 200)" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="ribbon-b" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="oklch(0.9 0.08 200)" stopOpacity="0" />
          <stop offset="0.5" stopColor="oklch(0.9 0.1 90)" stopOpacity="0.7" />
          <stop offset="1" stopColor="oklch(0.8 0.12 300)" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <path
        d="M520 900 C 760 640, 900 520, 1080 420 S 1360 260, 1520 120"
        fill="none"
        stroke="url(#ribbon-a)"
        strokeWidth="70"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M480 940 C 740 700, 920 560, 1100 470 S 1380 320, 1540 190"
        fill="none"
        stroke="url(#ribbon-b)"
        strokeWidth="26"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M560 880 C 800 620, 940 500, 1120 390 S 1380 230, 1520 80"
        fill="none"
        stroke="url(#ribbon-a)"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  )
}
