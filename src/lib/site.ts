/** Organisation details used across the site — edit here, not in components. */
export const site = {
  bankAccount: "1000706157364",
  phones: ["+251 96 452 1722", "+251 90 000 4848"],
  emails: ["Advertamr@gmail.com", "neziraworku198@gmail.com"],
  socials: {
    telegram: "https://t.me/HiraMuslimstudent",
    instagram: "https://www.instagram.com/hira_muslim_students_page1/",
  },
  /** Canonical URL for metadata/sitemap. Set NEXT_PUBLIC_SITE_URL in production. */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000"),
} as const

export const telHref = (phone: string) => `tel:${phone.replace(/\s/g, "")}`
