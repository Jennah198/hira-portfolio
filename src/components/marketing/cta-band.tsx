import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Accent, ArrowForward } from "@/components/shared/accent"
import type { Dictionary } from "@/i18n/dictionaries"

export function CtaBand({ t }: { t: Dictionary }) {
  return (
    <section className="px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      <div data-reveal className="relative isolate mx-auto max-w-6xl overflow-hidden rounded-3xl text-white">
        <Image src="/images/socialGathering.webp" alt="" fill sizes="(min-width: 1152px) 1152px, 100vw" className="-z-20 object-cover" />
        <div className="photo-overlay absolute inset-0 -z-10" />
        <div className="flex flex-col items-start gap-8 px-8 py-14 md:flex-row md:items-end md:justify-between md:px-14 md:py-20">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold leading-tight tracking-tight text-balance md:text-5xl">
              <Accent text={t.home.cta.title} tone="hero" />
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-white/85">{t.home.cta.text}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" variant="hero">
              <Link href="/membership">
                {t.home.cta.button}
                <ArrowForward />
              </Link>
            </Button>
            <Button asChild size="lg" variant="photo">
              <Link href="/contact">{t.home.cta.secondary}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
