import type { Metadata } from "next"
import { Phone } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { GraduationForm } from "@/components/forms/graduation-form"
import { BankAccount } from "@/components/shared/bank-account"
import { site, telHref } from "@/lib/site"
import { getI18n } from "@/i18n/server"

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n()
  return { title: t.meta.graduationTitle, description: t.graduationForm.header.subtitle }
}

export default async function GraduationRegistrationPage() {
  const { t } = await getI18n()
  const g = t.graduationForm

  return (
    <>
      <PageHeader
        image="/images/graduationSisters.webp"
        imagePosition="50% 38%"
        eyebrow={g.header.eyebrow}
        title={g.header.title}
        subtitle={g.header.subtitle}
        backHref="/events#graduation"
        backLabel={t.common.backToEvents}
        breadcrumbLabel={t.common.breadcrumb}
        crumbs={[
          { label: t.common.home, href: "/" },
          { label: t.nav.events, href: "/events" },
          { label: t.nav.graduation },
        ]}
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl items-start gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_2fr] lg:px-8">
          <aside className="space-y-4 lg:sticky lg:top-28">
            <div data-reveal>
              <BankAccount title={g.paymentTitle} label={g.accountLabel} note={g.accountNote} />
            </div>
            <div data-reveal className="glass rounded-3xl border p-7">
              <Phone aria-hidden className="size-6 text-gold" />
              <p className="mt-4 text-sm text-muted-foreground">{g.help}</p>
              <a href={telHref(site.phones[0])} dir="ltr" className="mt-1 block font-semibold hover:text-gold">
                {site.phones[0]}
              </a>
            </div>
          </aside>
          <div data-reveal className="glass-strong rounded-3xl border p-7 md:p-10">
            <GraduationForm />
          </div>
        </div>
      </section>
    </>
  )
}
