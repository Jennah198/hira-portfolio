import Image from "next/image"
import { BookOpen, GraduationCap, Heart, Lightbulb, Palette, Users } from "lucide-react"
import type { Dictionary } from "@/i18n/dictionaries"

export const PROGRAMME_MEDIA = [
  { icon: Heart, image: "/images/charity.webp" },
  { icon: GraduationCap, image: "/images/graduationSisters.webp", position: "50% 40%" },
  { icon: BookOpen, image: "/images/educationalStudies.webp" },
  { icon: Users, image: "/images/socialGathering.webp" },
  { icon: Lightbulb, image: "/images/religiousStudies.webp" },
  { icon: Palette, image: "/images/mechExhibition.webp" },
]

export function ProgrammesGrid({ t, limit }: { t: Dictionary; limit?: number }) {
  const items = t.programmes.slice(0, limit ?? t.programmes.length)
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
      {items.map((p, i) => {
        const media = PROGRAMME_MEDIA[i] ?? PROGRAMME_MEDIA[0]
        const Icon = media.icon
        return (
          <div key={p.title} data-reveal style={{ ["--reveal-delay" as string]: `${(i % 3) * 90}ms` }}>
            <article data-tilt className="group glass h-full overflow-hidden rounded-2xl border transition-shadow duration-500 hover:shadow-2xl">
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={media.image}
                  alt={p.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  style={"position" in media ? { objectPosition: media.position } : undefined}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <span className="absolute bottom-4 start-4 text-xs font-semibold tabular-nums text-white/80">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="glass-photo absolute bottom-4 end-4 inline-flex size-11 items-center justify-center rounded-full text-white">
                  <Icon aria-hidden className="size-5" />
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
              </div>
            </article>
          </div>
        )
      })}
    </div>
  )
}
