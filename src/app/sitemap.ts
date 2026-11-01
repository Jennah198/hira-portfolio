import type { MetadataRoute } from "next"
import { site } from "@/lib/site"

const ROUTES = [
  { path: "", priority: 1 },
  { path: "/about", priority: 0.8 },
  { path: "/our-work", priority: 0.8 },
  { path: "/events", priority: 0.8 },
  { path: "/membership", priority: 0.9 },
  { path: "/contact", priority: 0.7 },
  { path: "/privacy", priority: 0.3 },
  { path: "/events/graduation/register", priority: 0.6 },
  { path: "/events/exhibition/register", priority: 0.6 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((r) => ({
    url: `${site.url}${r.path}`,
    changeFrequency: "monthly",
    priority: r.priority,
  }))
}
