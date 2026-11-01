import type { Metadata } from "next"
import { PageHeader } from "@/components/shared/page-header"
import { ExhibitionForm } from "@/components/forms/exhibition-form"
import { getI18n } from "@/i18n/server"

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n()
  return { title: t.meta.exhibitionTitle, description: t.exhibitionForm.header.subtitle }
}

export default async function ExhibitionRegistrationPage() {
  const { t } = await getI18n()
  const x = t.exhibitionForm

  return (
    <>
      <PageHeader
        image="/images/exhibitionStands.webp"
        eyebrow={x.header.eyebrow}
        title={x.header.title}
        subtitle={x.header.subtitle}
        backHref="/events#exhibition"
        backLabel={t.common.backToEvents}
        breadcrumbLabel={t.common.breadcrumb}
        crumbs={[
          { label: t.common.home, href: "/" },
          { label: t.nav.events, href: "/events" },
          { label: t.nav.exhibition },
        ]}
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div data-reveal className="glass-strong rounded-3xl border p-7 md:p-10">
            <ExhibitionForm />
          </div>
        </div>
      </section>
    </>
  )
}
