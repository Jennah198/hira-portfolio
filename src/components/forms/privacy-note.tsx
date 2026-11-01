"use client"

import { Fragment } from "react"
import Link from "next/link"
import { useI18n } from "@/i18n/client"

/** "Your information is handled according to our {link}." with a link to /privacy. */
export function PrivacyNote() {
  const { t } = useI18n()
  const [before, after = ""] = t.common.privacyNote.split("{link}")
  return (
    <p className="text-center text-xs text-muted-foreground">
      <Fragment>{before}</Fragment>
      <Link href="/privacy" className="underline underline-offset-2 hover:text-gold">
        {t.footer.privacy}
      </Link>
      <Fragment>{after}</Fragment>
    </p>
  )
}
