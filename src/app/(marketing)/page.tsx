import Image from "next/image"
import Link from "next/link"
import { Hero } from "@/components/marketing/hero"
import { ImpactStats } from "@/components/marketing/stats"
import { ProgrammesGrid } from "@/components/marketing/programmes-grid"
import { EventsHighlight } from "@/components/marketing/events-highlight"
import { Steps } from "@/components/marketing/steps"
import { CtaBand } from "@/components/marketing/cta-band"
import { SectionHeading } from "@/components/shared/section-heading"
import { ArrowForward } from "@/components/shared/accent"
import { Button } from "@/components/ui/button"
import { getI18n } from "@/i18n/server"

export default async function HomePage() {
  const { t } = await getI18n()

  return (
    <>
      <Hero />

      {/* 01 — About */}
      <section id="about" className="py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
          <div>
            <SectionHeading index="01" eyebrow={t.home.about.eyebrow} title={t.home.about.title} align="start" className="mb-6 md:mb-8" />
            <p data-reveal className="text-lg leading-relaxed text-muted-foreground text-pretty">
              {t.home.about.body}
            </p>
            <div data-reveal className="mt-10 grid grid-cols-2 gap-5">
              {t.pillars.map((p) => (
                <div key={p.title} className="border-s-2 border-[var(--gold)]/60 ps-4">
                  <p className="font-semibold">{p.title}</p>
                  <p className="text-sm text-muted-foreground">{p.text}</p>
                </div>
              ))}
            </div>
            <Button asChild variant="outline" size="lg" className="mt-10" data-reveal>
              <Link href="/about">
                {t.home.about.cta}
                <ArrowForward />
              </Link>
            </Button>
          </div>
          <div data-reveal className="relative">
            <div data-tilt="1" className="relative aspect-[4/5] overflow-hidden rounded-3xl border glass p-2">
              <div className="relative h-full w-full overflow-hidden rounded-[1.25rem]">
                <Image src="/images/educationalStudies.webp" alt="" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
              </div>
            </div>
            <div className="glass absolute -bottom-6 start-6 flex items-center gap-4 rounded-2xl border p-4 pe-6 md:-start-8">
              <Image src="/images/hira-20logo.jpg" alt="" width={56} height={56} className="size-14 rounded-full object-cover" />
              <div>
                <p className="font-semibold">{t.common.brand}</p>
                <p className="text-xs text-muted-foreground">{t.common.motto}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 02 — Impact */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading index="02" eyebrow={t.home.impact.eyebrow} title={t.home.impact.title} intro={t.home.impact.intro} />
          <ImpactStats />
        </div>
      </section>

      {/* 03 — Programmes */}
      <section id="activities" className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading index="03" eyebrow={t.home.programmes.eyebrow} title={t.home.programmes.title} intro={t.home.programmes.intro} />
          <ProgrammesGrid t={t} />
          <div data-reveal className="mt-12 flex justify-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/our-work">
                {t.home.programmes.cta}
                <ArrowForward />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 04 — Events */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading index="04" eyebrow={t.home.events.eyebrow} title={t.home.events.title} intro={t.home.events.intro} />
          <EventsHighlight t={t} />
        </div>
      </section>

      {/* 05 — Get involved */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading index="05" eyebrow={t.home.steps.eyebrow} title={t.home.steps.title} intro={t.home.steps.intro} />
          <Steps t={t} />
        </div>
      </section>

      <CtaBand t={t} />
    </>
  )
}
