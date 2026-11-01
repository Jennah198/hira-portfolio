import type { Metadata } from "next"
import { PageHeader } from "@/components/shared/page-header"
import { getI18n } from "@/i18n/server"
import { format } from "@/i18n/config"
import { site } from "@/lib/site"

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n()
  return { title: t.meta.privacyTitle, description: t.privacy.subtitle }
}

export default async function PrivacyPage() {
  const { t } = await getI18n()
  const p = t.privacy

  return (
    <>
      <PageHeader
        image="/images/religiousFemaleStudies.webp"
        eyebrow={p.eyebrow}
        title={p.title}
        subtitle={p.subtitle}
        backHref="/"
        backLabel={t.common.backToHome}
        breadcrumbLabel={t.common.breadcrumb}
        crumbs={[{ label: t.common.home, href: "/" }, { label: t.footer.privacy }]}
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="mb-10 text-sm text-muted-foreground">{p.updated}</p>
          <div className="space-y-5">
            {p.sections.map((section, i) => (
              <article key={section.title} data-reveal className="glass rounded-2xl border p-7">
                <h2 className="flex items-baseline gap-3 text-xl font-semibold">
                  <span className="text-sm tabular-nums text-gold">{String(i + 1).padStart(2, "0")}</span>
                  {section.title}
                </h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {format(section.body, { email: site.emails[0], phone: site.phones[0] })}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
