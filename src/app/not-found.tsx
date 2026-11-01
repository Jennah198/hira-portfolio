import Link from "next/link"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { ArrowBack } from "@/components/shared/accent"
import { getI18n } from "@/i18n/server"

export default async function NotFound() {
  const { t } = await getI18n()
  return (
    <>
      <PageHeader
        image="/images/religiousStudies.webp"
        eyebrow={t.notFound.eyebrow}
        title={t.notFound.title}
        subtitle={t.notFound.text}
        backHref="/"
        backLabel={t.common.backToHome}
        breadcrumbLabel={t.common.breadcrumb}
        crumbs={[{ label: t.common.home, href: "/" }, { label: "404" }]}
      />
      <div className="flex justify-center py-16">
        <Button asChild size="lg">
          <Link href="/">
            <ArrowBack />
            {t.common.backToHome}
          </Link>
        </Button>
      </div>
    </>
  )
}
