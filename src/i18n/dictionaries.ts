import type { Locale } from "./config"
import type { Dictionary } from "./dictionaries/en"

const loaders: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./dictionaries/en").then((m) => m.default),
  ar: () => import("./dictionaries/ar").then((m) => m.default),
  am: () => import("./dictionaries/am").then((m) => m.default),
  zh: () => import("./dictionaries/zh").then((m) => m.default),
  es: () => import("./dictionaries/es").then((m) => m.default),
  fr: () => import("./dictionaries/fr").then((m) => m.default),
  hi: () => import("./dictionaries/hi").then((m) => m.default),
  bn: () => import("./dictionaries/bn").then((m) => m.default),
}

export function getDictionary(locale: Locale): Promise<Dictionary> {
  return loaders[locale]()
}

export type { Dictionary }
