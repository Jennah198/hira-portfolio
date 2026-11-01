/**
 * Supported languages: the seven most widely spoken languages worldwide (Ethnologue, total
 * speakers) plus Amharic for our home community in Ethiopia.
 * To add/remove a language: update `locales`, `localeMeta`, and add/remove a dictionary file.
 */
export const locales = ["en", "ar", "am", "zh", "es", "fr", "hi", "bn"] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "en"

export const LOCALE_COOKIE = "NEXT_LOCALE"

export const localeMeta: Record<
  Locale,
  { name: string; english: string; dir: "ltr" | "rtl"; intl: string }
> = {
  en: { name: "English", english: "English", dir: "ltr", intl: "en" },
  ar: { name: "العربية", english: "Arabic", dir: "rtl", intl: "ar" },
  am: { name: "አማርኛ", english: "Amharic", dir: "ltr", intl: "am-ET" },
  zh: { name: "中文", english: "Chinese", dir: "ltr", intl: "zh-CN" },
  es: { name: "Español", english: "Spanish", dir: "ltr", intl: "es" },
  fr: { name: "Français", english: "French", dir: "ltr", intl: "fr" },
  hi: { name: "हिन्दी", english: "Hindi", dir: "ltr", intl: "hi-IN" },
  bn: { name: "বাংলা", english: "Bengali", dir: "ltr", intl: "bn-BD" },
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value)
}

/** Picks the best supported locale from an Accept-Language header. */
export function matchLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return defaultLocale
  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=")
      return { tag: tag.toLowerCase(), q: q ? Number(q) : 1 }
    })
    .sort((a, b) => b.q - a.q)

  for (const { tag } of ranked) {
    const base = tag.split("-")[0]
    if (isLocale(base)) return base
  }
  return defaultLocale
}

/** Replaces `{name}` placeholders in a dictionary string. */
export function format(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? `{${key}}`))
}
