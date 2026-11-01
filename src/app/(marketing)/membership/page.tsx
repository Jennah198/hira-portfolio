import type { Metadata } from "next"
import { Award, CheckCircle2, ClipboardList, Rocket, Users } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { MembershipForm } from "@/components/forms/membership-form"
import { Steps } from "@/components/marketing/steps"
import { SectionHeading } from "@/components/shared/section-heading"
import { BankAccount } from "@/components/shared/bank-account"
import { getI18n } from "@/i18n/server"

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n()
  return { title: t.meta.membershipTitle, description: t.membership.header.subtitle }
}

export default async function MembershipPage() {
  const { t } = await getI18n()
  const m = t.membership

  return (
    <>
      <PageHeader
        image="/images/socialGathering.webp"
        eyebrow={m.header.eyebrow}
        title={m.header.title}
        subtitle={m.header.subtitle}
        backHref="/"
        backLabel={t.common.backToHome}
        breadcrumbLabel={t.common.breadcrumb}
        crumbs={[{ label: t.common.home, href: "/" }, { label: t.nav.membership }]}
      />

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading index="01" eyebrow={t.home.steps.eyebrow} title={t.home.steps.title} intro={t.home.steps.intro} />
          <Steps t={t} />
        </div>
      </section>

      <section id="apply" className="scroll-mt-28 py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:px-8">
          {/* Information */}
          <div className="space-y-6">
            <div data-reveal className="glass rounded-3xl border p-7 md:p-9">
              <h2 className="flex items-center gap-3 text-2xl font-semibold">
                <Award aria-hidden className="size-6 text-gold" />
                {m.benefits.title}
              </h2>
              <ul className="mt-6 space-y-3">
                {m.benefits.items.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-muted-foreground">
                    <CheckCircle2 aria-hidden className="mt-0.5 size-5 shrink-0 text-gold" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            <div data-reveal className="glass rounded-3xl border p-7 md:p-9">
              <h2 className="flex items-center gap-3 text-2xl font-semibold">
                <Users aria-hidden className="size-6 text-gold" />
                {m.eligibility.title}
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">{t.about.commitments.intro}</p>
              <ul className="mt-4 space-y-2">
                {t.about.commitments.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-muted-foreground">
                    <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-[var(--gold)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div data-reveal className="glass rounded-3xl border p-7 md:p-9">
              <h2 className="flex items-center gap-3 text-2xl font-semibold">
                <Rocket aria-hidden className="size-6 text-gold" />
                {m.responsibilities.title}
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">{m.responsibilities.body}</p>
            </div>

            <div data-reveal className="glass rounded-3xl border p-7 md:p-9">
              <h2 className="flex items-center gap-3 text-2xl font-semibold">
                <ClipboardList aria-hidden className="size-6 text-gold" />
                {m.requirements.title}
              </h2>
              <ul className="mt-4 space-y-2">
                {m.requirements.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-muted-foreground">
                    <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-[var(--gold)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div data-reveal>
              <BankAccount title={m.payment.title} label={t.graduationForm.accountLabel} note={m.payment.text} />
            </div>
          </div>

          {/* Form */}
          <div data-reveal className="lg:sticky lg:top-28">
            <div className="glass-strong rounded-3xl border p-7 md:p-10">
              <h2 className="text-2xl font-semibold md:text-3xl">{m.form.title}</h2>
              <p className="mt-2 mb-8 text-sm text-muted-foreground">{m.form.intro}</p>
              <MembershipForm />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
