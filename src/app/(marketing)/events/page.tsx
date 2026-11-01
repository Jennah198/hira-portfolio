import type { Metadata } from "next"
import Link from "next/link"
import { Award, BookOpen, Calendar, CheckCircle2, MapPin, Users } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { SectionHeading } from "@/components/shared/section-heading"
import { ArrowForward } from "@/components/shared/accent"
import { EventGallery } from "@/components/marketing/event-gallery"
import { ImpactStats } from "@/components/marketing/stats"
import { CtaBand } from "@/components/marketing/cta-band"
import { Button } from "@/components/ui/button"
import { getI18n } from "@/i18n/server"
import type { Dictionary } from "@/i18n/dictionaries"
import { cn } from "@/lib/utils"

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n()
  return { title: t.meta.eventsTitle, description: t.events.header.subtitle }
}

type EventBlockProps = {
  id: string
  index: string
  icon: typeof Award
  images: string[]
  data: Dictionary["events"]["graduation"] | Dictionary["events"]["exhibition"]
  listTitle: string
  list: string[]
  registerHref: string
  reverse?: boolean
  t: Dictionary
}

function EventBlock({ id, index, icon: Icon, images, data, listTitle, list, registerHref, reverse, t }: EventBlockProps) {
  return (
    <section id={id} className="scroll-mt-28 py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl items-start gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div className={cn(reverse && "lg:order-2")}>
          <p data-reveal className="eyebrow mb-5">
            <span className="tabular-nums opacity-80">{index}</span>
            {data.badge}
          </p>
          <h2 data-reveal className="flex items-center gap-3 text-3xl font-semibold tracking-tight md:text-5xl">
            <Icon aria-hidden className="size-8 shrink-0 text-gold" />
            {data.title}
          </h2>
          <p data-reveal className="mt-6 text-lg leading-relaxed text-muted-foreground">
            {data.body}
          </p>

          <dl data-reveal className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Calendar, label: t.events.when, value: data.whenValue },
              { icon: MapPin, label: t.events.where, value: data.whereValue },
              { icon: Users, label: data.who, value: data.whoValue },
            ].map((row) => (
              <div key={row.label} className="glass rounded-2xl border p-4">
                <row.icon aria-hidden className="size-5 text-gold" />
                <dt className="mt-3 text-sm font-semibold">{row.label}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{row.value}</dd>
              </div>
            ))}
          </dl>

          <Button asChild size="lg" className="mt-10" data-reveal>
            <Link href={registerHref}>
              {data.cta}
              <ArrowForward />
            </Link>
          </Button>
        </div>

        <div className={cn("space-y-6", reverse && "lg:order-1")}>
          <div data-reveal>
            <div data-tilt={reverse ? -1 : 1} className="glass overflow-hidden rounded-3xl border p-2">
              <EventGallery images={images} alt={data.title} />
            </div>
          </div>
          <div data-reveal className="glass rounded-3xl border p-7">
            <h3 className="text-lg font-semibold">{listTitle}</h3>
            <ul className="mt-4 space-y-3">
              {list.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 aria-hidden className="mt-0.5 size-4 shrink-0 text-gold" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default async function EventsPage() {
  const { t } = await getI18n()

  return (
    <>
      <PageHeader
        image="/images/graduationPoster.webp"
        eyebrow={t.events.header.eyebrow}
        title={t.events.header.title}
        subtitle={t.events.header.subtitle}
        backHref="/"
        backLabel={t.common.backToHome}
        breadcrumbLabel={t.common.breadcrumb}
        crumbs={[{ label: t.common.home, href: "/" }, { label: t.nav.events }]}
      />

      <EventBlock
        id="graduation"
        index="01"
        icon={Award}
        images={["/images/graduationSisters.webp", "/images/gradwithredgawn.webp", "/images/certificates.webp", "/images/graduationPoster.webp"]}
        data={t.events.graduation}
        listTitle={t.events.graduation.highlightsTitle}
        list={t.events.graduation.highlights}
        registerHref="/events/graduation/register"
        t={t}
      />

      <EventBlock
        id="exhibition"
        index="02"
        icon={BookOpen}
        images={["/images/exhibitionStands.webp", "/images/swExhibition.webp", "/images/mechExhibition.webp"]}
        data={t.events.exhibition}
        listTitle={t.events.exhibition.featuresTitle}
        list={t.events.exhibition.features}
        registerHref="/events/exhibition/register"
        reverse
        t={t}
      />

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading index="03" eyebrow={t.events.impact.eyebrow} title={t.events.impact.title} />
          <ImpactStats />
        </div>
      </section>

      <CtaBand t={t} />
    </>
  )
}
