import type { Metadata } from "next"
import { PageHeader } from "@/components/shared/page-header"
import { SectionHeading } from "@/components/shared/section-heading"
import { ProgrammesGrid } from "@/components/marketing/programmes-grid"
import { ImpactStats } from "@/components/marketing/stats"
import { CtaBand } from "@/components/marketing/cta-band"
import { getI18n } from "@/i18n/server"

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n()
  return { title: t.meta.ourWorkTitle, description: t.ourWork.header.subtitle }
}

export default async function OurWorkPage() {
  const { t } = await getI18n()

  return (
    <>
      <PageHeader
        image="/images/charity.webp"
        eyebrow={t.ourWork.header.eyebrow}
        title={t.ourWork.header.title}
        subtitle={t.ourWork.header.subtitle}
        backHref="/"
        backLabel={t.common.backToHome}
        breadcrumbLabel={t.common.breadcrumb}
        crumbs={[{ label: t.common.home, href: "/" }, { label: t.nav.ourWork }]}
      />

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading index="01" eyebrow={t.ourWork.approach.eyebrow} title={t.ourWork.approach.title} intro={t.ourWork.approach.intro} />
          <ProgrammesGrid t={t} />
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading index="02" eyebrow={t.home.impact.eyebrow} title={t.home.impact.title} intro={t.home.impact.intro} />
          <ImpactStats />
        </div>
      </section>

      <CtaBand t={t} />
    </>
  )
}
