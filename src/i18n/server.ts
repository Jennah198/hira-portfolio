import { cookies, headers } from "next/headers"
import { cache } from "react"
import { LOCALE_COOKIE, isLocale, localeMeta, matchLocale, type Locale } from "./config"
import { getDictionary } from "./dictionaries"

/** Locale from the language cookie, falling back to the browser's Accept-Language. */
export const getLocale = cache(async (): Promise<Locale> => {
  const fromCookie = (await cookies()).get(LOCALE_COOKIE)?.value
  if (isLocale(fromCookie)) return fromCookie
  return matchLocale((await headers()).get("accept-language"))
})

export const getI18n = cache(async () => {
  const locale = await getLocale()
  return { locale, dir: localeMeta[locale].dir, t: await getDictionary(locale) }
})
