"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { ChevronDown, Mail, MapPin, Menu, Phone, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { LanguageSwitcher } from "@/components/shared/language-switcher"
import { ArrowForward } from "@/components/shared/accent"
import { useI18n } from "@/i18n/client"
import { cn } from "@/lib/utils"
import { site, telHref } from "@/lib/site"

const CONTACT_PHONE = site.phones[0]
const CONTACT_EMAIL = site.emails[0]

export function Navbar() {
  const { t } = useI18n()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Public pages start with a photo header, so the bar sits transparently on top of it.
  const isPublic = !pathname.startsWith("/admin") && !pathname.startsWith("/auth")
  const overlay = isPublic && !scrolled && !open

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/about", label: t.nav.about },
    { href: "/our-work", label: t.nav.ourWork },
  ]
  const trailing = [
    { href: "/membership", label: t.nav.membership },
    { href: "/contact", label: t.nav.contact },
  ]
  const eventLinks = [
    { href: "/events", label: t.nav.allEvents },
    { href: "/events#graduation", label: t.nav.graduation },
    { href: "/events#exhibition", label: t.nav.exhibition },
  ]

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href))

  const linkClass = (active: boolean) =>
    cn(
      "relative px-3 py-2 text-sm font-medium transition-colors after:absolute after:inset-x-3 after:-bottom-0.5 after:h-px after:origin-left after:transition-transform after:duration-300",
      overlay ? "text-white/85 hover:text-white after:bg-white" : "text-foreground/75 hover:text-foreground after:bg-[var(--gold)]",
      active ? "after:scale-x-100 " + (overlay ? "text-white" : "text-foreground") : "after:scale-x-0 hover:after:scale-x-100",
    )

  const iconBtn = overlay ? "text-white hover:bg-white/10" : ""

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color,color] duration-500",
        overlay ? "border-b border-transparent text-white" : "glass-strong border-b text-foreground",
      )}
    >
      {/* Formal top bar (public pages, collapses on scroll) */}
      {isPublic ? (
        <div
          className={cn(
            "hidden overflow-hidden transition-all duration-500 md:block",
            scrolled || open ? "max-h-0 opacity-0" : "max-h-10 opacity-100",
          )}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 border-b border-white/10 px-4 py-2 text-xs text-white/75 sm:px-6 lg:px-8">
            <p className="tracking-wide">{t.common.motto}</p>
            <div className="flex items-center gap-5">
              <a href={telHref(CONTACT_PHONE)} className="inline-flex items-center gap-1.5 hover:text-white" dir="ltr">
                <Phone aria-hidden className="size-3.5" />
                {CONTACT_PHONE}
              </a>
              <a href={`mailto:${CONTACT_EMAIL}`} className="hidden items-center gap-1.5 hover:text-white lg:inline-flex">
                <Mail aria-hidden className="size-3.5" />
                {CONTACT_EMAIL}
              </a>
              <span className="inline-flex items-center gap-1.5">
                <MapPin aria-hidden className="size-3.5" />
                {t.topbar.location}
              </span>
            </div>
          </div>
        </div>
      ) : null}

      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image
            src="/images/hira-20logo.jpg"
            alt=""
            width={44}
            height={44}
            className="size-11 rounded-full object-cover ring-1 ring-white/30"
            priority
          />
          <span className="flex flex-col leading-tight">
            <span className="text-lg font-bold">{t.common.brandShort}</span>
            <span className={cn("hidden text-[11px] sm:block", overlay ? "text-white/70" : "text-muted-foreground")}>
              {t.common.brandSub}
            </span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-0.5 xl:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={linkClass(isActive(l.href))}>
              {l.label}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger className={cn(linkClass(isActive("/events")), "inline-flex items-center gap-1 outline-none")}>
              {t.nav.events}
              <ChevronDown aria-hidden className="size-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-56 rounded-xl p-1.5">
              {eventLinks.map((l) => (
                <DropdownMenuItem key={l.href} asChild className="cursor-pointer rounded-lg px-3 py-2">
                  <Link href={l.href}>{l.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {trailing.map((l) => (
            <Link key={l.href} href={l.href} className={linkClass(isActive(l.href))}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <LanguageSwitcher className={iconBtn} />
          <ThemeToggle className={iconBtn} label={t.common.toggleTheme} />
          <Button asChild size="sm" variant={overlay ? "hero" : "default"} className="ms-2 hidden sm:inline-flex">
            <Link href="/membership">
              {t.nav.becomeMember}
              <ArrowForward />
            </Link>
          </Button>
          <button
            type="button"
            className={cn("ms-1 inline-flex size-10 items-center justify-center rounded-full transition-colors xl:hidden", overlay ? "hover:bg-white/10" : "hover:bg-foreground/[0.06]")}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t.common.closeMenu : t.common.openMenu}
            aria-expanded={open}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open ? (
        <div className="h-[calc(100dvh-72px)] overflow-y-auto border-t xl:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-6 sm:px-6">
            {[...links, ...eventLinks.map((l, i) => ({ ...l, sub: i > 0 })), ...trailing].map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "enter flex items-center justify-between rounded-xl px-4 py-3 font-medium transition-colors hover:bg-foreground/[0.06]",
                  "sub" in l && l.sub ? "ps-8 text-base text-muted-foreground" : "text-xl",
                  isActive(l.href) && !("sub" in l && l.sub) ? "text-gold" : "",
                )}
                style={{ ["--enter-delay" as string]: `${i * 40}ms` }}
                onClick={() => setOpen(false)}
              >
                {l.label}
                <ArrowForward className="opacity-40" />
              </Link>
            ))}
            <Button asChild size="lg" className="mt-4 w-full">
              <Link href="/membership" onClick={() => setOpen(false)}>
                {t.nav.becomeMember}
                <ArrowForward />
              </Link>
            </Button>
            <div className="mt-6 space-y-2 border-t pt-6 text-sm text-muted-foreground">
              <p dir="ltr" className="flex items-center gap-2 rtl:justify-end">
                <Phone aria-hidden className="size-4" /> {CONTACT_PHONE}
              </p>
              <p className="flex items-center gap-2">
                <Mail aria-hidden className="size-4" /> {CONTACT_EMAIL}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
