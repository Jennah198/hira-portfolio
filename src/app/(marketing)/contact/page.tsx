import type { Metadata } from "next"
import { Clock, Mail, MapPin, Phone } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { ContactForm } from "@/components/forms/contact-form"
import { SocialLinks } from "@/components/shared/social-links"
import { getI18n } from "@/i18n/server"
import { site, telHref } from "@/lib/site"

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n()
  return { title: t.meta.contactTitle, description: t.contact.header.subtitle }
}

export default async function ContactPage() {
  const { t } = await getI18n()
  const c = t.contact

  const channels = [
    {
      icon: Mail,
      title: c.email,
      lines: [
        ...site.emails.map((e) => (
          <a key={e} href={`mailto:${e}`} className="hover:text-gold">
            {e}
          </a>
        )),
      ],
      note: c.replyTime,
    },
    {
      icon: Phone,
      title: c.phone,
      lines: [
        ...site.phones.map((p) => (
          <a key={p} href={telHref(p)} dir="ltr" className="hover:text-gold">
            {p}
          </a>
        )),
      ],
      note: c.hours,
    },
    {
      icon: MapPin,
      title: c.location,
      lines: [<span key="1">{c.locationLine1}</span>, <span key="2">{c.locationLine2}</span>],
    },
  ]

  return (
    <>
      <PageHeader
        image="/images/religiousFemaleStudies.webp"
        eyebrow={c.header.eyebrow}
        title={c.header.title}
        subtitle={c.header.subtitle}
        backHref="/"
        backLabel={t.common.backToHome}
        breadcrumbLabel={t.common.breadcrumb}
        crumbs={[{ label: t.common.home, href: "/" }, { label: t.nav.contact }]}
      />

      <section className="py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:gap-16 lg:px-8">
          <div>
            <p data-reveal className="eyebrow mb-5">
              <span className="tabular-nums opacity-80">01</span>
              {c.info.title}
            </p>
            <p data-reveal className="text-lg leading-relaxed text-muted-foreground">{c.info.intro}</p>
            <div className="mt-10 space-y-4">
              {channels.map((ch, i) => (
                <div
                  key={ch.title}
                  data-reveal
                  style={{ ["--reveal-delay" as string]: `${i * 90}ms` }}
                  className="glass flex items-start gap-5 rounded-2xl border p-6"
                >
                  <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <ch.icon aria-hidden className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="font-semibold">{ch.title}</h2>
                    <div className="mt-1 flex flex-col text-sm text-muted-foreground [overflow-wrap:anywhere]">{ch.lines}</div>
                    {ch.note ? (
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock aria-hidden className="size-3" />
                        {ch.note}
                      </p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
            <div data-reveal className="mt-10">
              <p className="mb-4 font-semibold">{c.follow}</p>
              <SocialLinks />
            </div>
          </div>

          <div data-reveal className="glass-strong rounded-3xl border p-7 md:p-10">
            <h2 className="mb-8 text-2xl font-semibold md:text-3xl">{c.form.title}</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  )
}
