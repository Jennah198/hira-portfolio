import Image from "next/image"
import Link from "next/link"
import { Clock, Mail, MapPin, Phone } from "lucide-react"
import { getI18n } from "@/i18n/server"
import { format } from "@/i18n/config"
import { BackToTop } from "@/components/shared/back-to-top"
import { SocialLinks } from "@/components/shared/social-links"
import { site, telHref } from "@/lib/site"

export async function Footer() {
  const { t } = await getI18n()

  const columns = [
    {
      title: t.footer.association,
      links: [
        { href: "/about", label: t.nav.about },
        { href: "/our-work", label: t.nav.ourWork },
        { href: "/events", label: t.nav.events },
        { href: "/events#graduation", label: t.nav.graduation },
        { href: "/events#exhibition", label: t.nav.exhibition },
      ],
    },
    {
      title: t.footer.getInvolved,
      links: [
        { href: "/membership", label: t.nav.becomeMember },
        { href: "/events/graduation/register", label: t.footer.registerGraduation },
        { href: "/events/exhibition/register", label: t.footer.submitProject },
        { href: "/contact", label: t.nav.contact },
      ],
    },
  ]

  return (
    <footer className="glass-strong mt-12 border-t text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/images/hira-20logo.jpg" alt="" width={52} height={52} className="size-13 rounded-full object-cover" />
              <span className="text-lg font-bold leading-tight">{t.common.brand}</span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">{t.footer.about}</p>
            <p className="mt-6 mb-3 text-sm font-semibold">{t.footer.connect}</p>
            <SocialLinks />
          </div>

          {columns.map((col) => (
            <div key={col.title} className="lg:col-span-2">
              <h3 className="mb-5 text-sm font-semibold text-gold">{col.title}</h3>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-4">
            <h3 className="mb-5 text-sm font-semibold text-gold">{t.footer.contactUs}</h3>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <Phone aria-hidden className="mt-0.5 size-4 shrink-0 text-gold" />
                <span>
                  <a href={telHref(site.phones[0])} dir="ltr" className="block text-foreground hover:text-gold">
                    {site.phones[0]}
                  </a>
                  <span className="mt-0.5 flex items-center gap-1 text-xs">
                    <Clock aria-hidden className="size-3" />
                    {t.contact.hours}
                  </span>
                </span>
              </li>
              <li className="flex gap-3">
                <Mail aria-hidden className="mt-0.5 size-4 shrink-0 text-gold" />
                <span>
                  <a href={`mailto:${site.emails[0]}`} className="block text-foreground hover:text-gold">
                    {site.emails[0]}
                  </a>
                  <span className="mt-0.5 block text-xs">{t.contact.replyTime}</span>
                </span>
              </li>
              <li className="flex gap-3">
                <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-gold" />
                <span>
                  <span className="block text-foreground">{t.contact.locationLine1}</span>
                  {t.contact.locationLine2}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-5 border-t pt-8 text-xs text-muted-foreground md:flex-row">
          <p>{format(t.footer.rights, { year: new Date().getFullYear() })}</p>
          <div className="flex flex-wrap items-center justify-center gap-5">
            <Link href="/privacy" className="hover:text-foreground">
              {t.footer.privacy}
            </Link>
            <BackToTop label={t.common.backToTop} />
          </div>
        </div>
      </div>
    </footer>
  )
}
