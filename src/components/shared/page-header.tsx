import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Accent, ArrowBack } from "@/components/shared/accent"

type Crumb = { label: string; href?: string }

type Props = {
  image: string
  /** CSS object-position for the photo, e.g. "50% 30%" to keep faces in frame */
  imagePosition?: string
  eyebrow: string
  title: string
  subtitle?: string
  backHref: string
  backLabel: string
  crumbs: Crumb[]
  breadcrumbLabel: string
}

/** Photographic page banner used on every inner page: back button, breadcrumbs, title. */
export function PageHeader({ image, imagePosition, eyebrow, title, subtitle, backHref, backLabel, crumbs, breadcrumbLabel }: Props) {
  return (
    <section className="relative isolate flex min-h-[440px] md:min-h-[540px] items-end overflow-hidden text-white">
      <div className="absolute inset-0 -z-20" data-parallax="0.18">
        <Image src={image} alt="" fill priority sizes="100vw" className="object-cover scale-105" style={imagePosition ? { objectPosition: imagePosition } : undefined} />
      </div>
      <div className="photo-overlay absolute inset-0 -z-10" />

      <div className="mx-auto w-full max-w-7xl px-4 pb-14 pt-40 sm:px-6 md:pb-20 lg:px-8">
        <div className="enter mb-8 flex flex-wrap items-center gap-x-5 gap-y-3">
          <Link
            href={backHref}
            className="group/btn glass-photo inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-white/20"
          >
            <ArrowBack />
            {backLabel}
          </Link>
          <nav aria-label={breadcrumbLabel}>
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/70">
              {crumbs.map((crumb, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  {i > 0 ? <ChevronRight aria-hidden className="size-3.5 rtl:-scale-x-100" /> : null}
                  {crumb.href ? (
                    <Link href={crumb.href} className="transition-colors hover:text-white">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-white">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>

        <p className="enter eyebrow mb-4 !text-[oklch(0.9_0.1_85)]" style={{ ["--enter-delay" as string]: "100ms" }}>
          {eyebrow}
        </p>
        <h1
          className="enter max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight text-balance md:text-6xl"
          style={{ ["--enter-delay" as string]: "180ms" }}
        >
          <Accent text={title} tone="hero" />
        </h1>
        {subtitle ? (
          <p
            className="enter mt-5 max-w-2xl text-lg leading-relaxed text-white/85 text-pretty"
            style={{ ["--enter-delay" as string]: "260ms" }}
          >
            {subtitle}
          </p>
        ) : null}
      </div>
    </section>
  )
}
