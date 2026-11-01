"use client"

import Link from "next/link"
import { useEffect } from "react"
import { RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accent, ArrowBack } from "@/components/shared/accent"
import { useI18n } from "@/i18n/client"

/** Graceful fallback for unexpected rendering errors (keeps navbar/footer). */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useI18n()

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 pt-32 pb-20 text-center">
      <p className="eyebrow mb-5" data-align="center">
        {t.errorPage.eyebrow}
      </p>
      <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
        <Accent text={t.errorPage.title} />
      </h1>
      <p className="mt-5 text-lg text-muted-foreground">{t.errorPage.text}</p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button size="lg" onClick={reset}>
          <RotateCcw aria-hidden className="size-4" />
          {t.errorPage.retry}
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/">
            <ArrowBack />
            {t.common.backToHome}
          </Link>
        </Button>
      </div>
    </section>
  )
}
