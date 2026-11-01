import Image from "next/image"
import Link from "next/link"
import { Award, BookOpen, Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ArrowForward } from "@/components/shared/accent"
import type { Dictionary } from "@/i18n/dictionaries"

export function EventsHighlight({ t }: { t: Dictionary }) {
  const events = [
    {
      id: "graduation",
      icon: Award,
      image: "/images/gradwithredgawn.webp",
      data: t.events.graduation,
      register: "/events/graduation/register",
    },
    {
      id: "exhibition",
      icon: BookOpen,
      image: "/images/swExhibition.webp",
      data: t.events.exhibition,
      register: "/events/exhibition/register",
    },
  ]
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {events.map((e, i) => {
        const Icon = e.icon
        return (
          <div key={e.id} data-reveal style={{ ["--reveal-delay" as string]: `${i * 120}ms` }}>
            <article data-tilt={i ? 1 : -1} className="group glass flex h-full flex-col overflow-hidden rounded-3xl border">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={e.image}
                  alt={e.data.title}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                <span className="glass-photo absolute start-5 top-5 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-white">
                  <Icon aria-hidden className="size-3.5" />
                  {e.data.badge}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-7 md:p-9">
                <h3 className="text-2xl font-semibold md:text-3xl">{e.data.title}</h3>
                <p className="mt-4 leading-relaxed text-muted-foreground">{e.data.summary}</p>
                <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
                  <div className="flex gap-2">
                    <Calendar aria-hidden className="mt-0.5 size-4 shrink-0 text-gold" />
                    <div>
                      <dt className="font-medium">{t.events.when}</dt>
                      <dd className="text-muted-foreground">{e.data.whenValue}</dd>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-gold" />
                    <div>
                      <dt className="font-medium">{t.events.where}</dt>
                      <dd className="text-muted-foreground">{e.data.whereValue}</dd>
                    </div>
                  </div>
                </dl>
                <div className="mt-8 flex flex-wrap gap-3 pt-2 md:mt-auto">
                  <Button asChild>
                    <Link href={e.register}>
                      {e.data.cta}
                      <ArrowForward />
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href={`/events#${e.id}`}>{e.data.details}</Link>
                  </Button>
                </div>
              </div>
            </article>
          </div>
        )
      })}
    </div>
  )
}
