"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, ChevronDown, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { usePathname } from "next/navigation"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const showBackHome = pathname !== "/"

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/#about", label: "About" },
    { href: "/#activities", label: "Activities" },
    { href: "/membership", label: "Membership" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image
              src="/images/hira-20logo.jpg"
              alt="Hira Muslim Students Association"
              width={10}
              height={10}
              className="w-1/6 h-1/6 object-cover rounded-full"
            />
            <span className="font-bold text-lg md:text-xl text-foreground">Hira</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground/80 hover:text-primary font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger className="text-foreground/80 hover:text-primary font-medium transition-colors flex items-center gap-1">
                Events
                <ChevronDown size={16} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/events#graduation" className="cursor-pointer">
                    Graduation Ceremony
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/events#exhibition" className="cursor-pointer">
                    Annual Exhibition
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ThemeToggle />
            {showBackHome && (
              <Button asChild variant="outline" className="bg-background/80" aria-label="Go back to home">
                <Link href="/">
                  <ArrowLeft className="size-4" />
                  Home
                </Link>
              </Button>
            )}
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/membership">Become a Member</Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              className="lg:hidden p-2"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={24} className="text-foreground" /> : <Menu size={24} className="text-foreground" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="lg:hidden py-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-3 px-2 text-foreground/80 hover:text-primary hover:bg-accent rounded-md font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="py-3 px-2">
              <p className="font-medium text-foreground/80 mb-2">Events</p>
              <Link
                href="/events#graduation"
                className="block py-2 px-4 text-sm text-foreground/70 hover:text-primary hover:bg-accent rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Graduation Ceremony
              </Link>
              <Link
                href="/events#exhibition"
                className="block py-2 px-4 text-sm text-foreground/70 hover:text-primary hover:bg-accent rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Annual Exhibition
              </Link>
            </div>
            <div className="pt-2">
              {showBackHome && (
                <Button asChild variant="outline" className="w-full bg-background/80 mb-2" aria-label="Go back to home">
                  <Link href="/" onClick={() => setIsOpen(false)}>
                    <ArrowLeft className="size-4" />
                    Home
                  </Link>
                </Button>
              )}
              <Button asChild className="w-full bg-primary hover:bg-primary/90">
                <Link href="/membership" onClick={() => setIsOpen(false)}>
                  Become a Member
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
