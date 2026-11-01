import type { Metadata } from "next"
import Image from "next/image"
import { Award, BookOpen, CheckCircle2, Compass, HandHeart, Moon, Target } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { SectionHeading } from "@/components/shared/section-heading"
import { CtaBand } from "@/components/marketing/cta-band"
import { getI18n } from "@/i18n/server"

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n()
  return { title: t.meta.aboutTitle, description: t.about.header.subtitle }
}

const VALUE_ICONS = [Moon, BookOpen, HandHeart, Award]

export default async function AboutPage() {
  const { t } = await getI18n()

  return (
    <>
      <PageHeader
        image="/images/religiousStudies.webp"
        eyebrow={t.about.header.eyebrow}
        title={t.about.header.title}
        subtitle={t.about.header.subtitle}
        backHref="/"
        backLabel={t.common.backToHome}
        breadcrumbLabel={t.common.breadcrumb}
        crumbs={[{ label: t.common.home, href: "/" }, { label: t.nav.about }]}
      />

      {/* Story + name */}
      <section className="py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
          <div>
            <SectionHeading index="01" eyebrow={t.about.whoWeAre.eyebrow} title={t.about.whoWeAre.title} align="start" className="mb-6 md:mb-8" />
            <p data-reveal className="text-lg leading-relaxed text-muted-foreground">{t.about.whoWeAre.body}</p>
            <div data-reveal className="glass mt-10 rounded-2xl border p-7">
              <h3 className="text-lg font-semibold">{t.about.name.title}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{t.about.name.body}</p>
            </div>
          </div>
          <div data-reveal>
            <div data-tilt="1" className="glass relative aspect-[4/3] overflow-hidden rounded-3xl border p-2">
              <div className="relative h-full w-full overflow-hidden rounded-[1.25rem] bg-[oklch(0.2_0.06_262)]">
                <Image src="/images/darkPostureLogo.png" alt={t.common.brand} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-contain p-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & mission */}
      <section className="py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          {[
            { icon: Compass, ...t.about.vision },
            { icon: Target, ...t.about.mission },
          ].map((item, i) => {
            const Icon = item.icon
            return (
              <div key={item.title} data-reveal style={{ ["--reveal-delay" as string]: `${i * 120}ms` }}>
                <article data-tilt={i ? 1 : -1} className="glass h-full rounded-3xl border p-8 md:p-12">
                  <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                    <Icon aria-hidden className="size-6" />
                  </span>
                  <p className="eyebrow mt-8 mb-3">{String(i + 2).padStart(2, "0")}</p>
                  <h2 className="text-2xl font-semibold md:text-3xl">{item.title}</h2>
                  <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{item.body}</p>
                </article>
              </div>
            )
          })}
        </div>
      </section>

      {/* Core values */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading index="04" eyebrow={t.about.values.eyebrow} title={t.about.values.title} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {t.pillars.map((p, i) => {
              const Icon = VALUE_ICONS[i] ?? Award
              return (
                <div
                  key={p.title}
                  data-reveal
                  style={{ ["--reveal-delay" as string]: `${i * 90}ms` }}
                  className="glass group rounded-2xl border p-7 transition-transform duration-500 hover:-translate-y-1"
                >
                  <span className="inline-flex size-12 items-center justify-center rounded-full border border-[var(--gold)]/40 text-gold transition-colors group-hover:bg-[var(--gold)] group-hover:text-[var(--background)]">
                    <Icon aria-hidden className="size-5" />
                  </span>
                  <h3 className="mt-6 text-xl font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Commitments */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeading index="05" eyebrow={t.about.commitments.eyebrow} title={t.about.commitments.title} intro={t.about.commitments.intro} />
          <ul className="grid gap-4 sm:grid-cols-2">
            {t.about.commitments.items.map((item, i) => (
              <li
                key={item}
                data-reveal
                style={{ ["--reveal-delay" as string]: `${i * 80}ms` }}
                className="glass flex items-start gap-3 rounded-2xl border p-5"
              >
                <CheckCircle2 aria-hidden className="mt-0.5 size-5 shrink-0 text-gold" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand t={t} />
    </>
  )
}
