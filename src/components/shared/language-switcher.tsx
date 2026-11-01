"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Check, Globe } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LOCALE_COOKIE, locales, localeMeta, type Locale } from "@/i18n/config"
import { useI18n } from "@/i18n/client"
import { cn } from "@/lib/utils"

function persistLocale(next: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`
}

export function LanguageSwitcher({ className, showLabel = false }: { className?: string; showLabel?: boolean }) {
  const { locale, t } = useI18n()
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function choose(next: Locale) {
    if (next === locale) return
    persistLocale(next)
    startTransition(() => router.refresh())
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t.common.language}
        className={cn(
          "inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium outline-none transition-colors hover:bg-foreground/[0.06] focus-visible:ring-2 focus-visible:ring-ring/50",
          pending && "opacity-60",
          className,
        )}
      >
        <Globe aria-hidden className="size-4" />
        <span className={cn(showLabel ? "" : "uppercase")}>{showLabel ? localeMeta[locale].name : locale}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 rounded-xl p-1.5">
        {locales.map((code) => (
          <DropdownMenuItem
            key={code}
            onSelect={() => choose(code)}
            lang={code}
            dir={localeMeta[code].dir}
            className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 cursor-pointer"
          >
            <span className="flex flex-col">
              <span className="font-medium">{localeMeta[code].name}</span>
              <span className="text-xs text-muted-foreground" dir="ltr">
                {localeMeta[code].english}
              </span>
            </span>
            {code === locale ? <Check aria-hidden className="size-4 text-gold" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
