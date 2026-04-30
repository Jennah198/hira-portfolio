import Link from "next/link"
import { Facebook, Instagram, Mail, MapPin, Phone, Send } from "lucide-react"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12">
                <Image
                  src="/images/hira-20logo.jpg"
                  alt="Hira Muslim Students Association"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <h3 className="font-bold text-lg">Hira Muslim Students Association</h3>
            </div>
            <p className="text-sm opacity-90 leading-relaxed max-w-md">
              Empowering students through Islamic values, academic excellence, and community service. We are dedicated
              to building knowledge, fostering leadership, and creating positive change in our community.
            </p>
            <div className="mt-6">
              <h4 className="font-semibold mb-3 text-sm">Connect With Us</h4>
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={18} />
                </a>
                <a
                  href="https://www.instagram.com/hira_muslim_students_page1/"
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href="https://t.me/HiraMuslimstudent"
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                  aria-label="Telegram"
                >
                  <Send size={18} />
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-sm opacity-90 hover:opacity-100 hover:translate-x-1 transition-all">
                Home
              </Link>
              <Link
                href="/#about"
                className="block text-sm opacity-90 hover:opacity-100 hover:translate-x-1 transition-all"
              >
                About Us
              </Link>
              <Link
                href="/#activities"
                className="block text-sm opacity-90 hover:opacity-100 hover:translate-x-1 transition-all"
              >
                Activities
              </Link>
              <Link
                href="/events"
                className="block text-sm opacity-90 hover:opacity-100 hover:translate-x-1 transition-all"
              >
                Events
              </Link>
              <Link
                href="/membership"
                className="block text-sm opacity-90 hover:opacity-100 hover:translate-x-1 transition-all"
              >
                Membership
              </Link>
              <Link
                href="/contact"
                className="block text-sm opacity-90 hover:opacity-100 hover:translate-x-1 transition-all"
              >
                Contact
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm opacity-90">
                <Phone size={16} className="mt-0.5 flex-shrink-0" />
                <div>
                  <div>+2519 6452 1722</div>
                  <div className="text-xs opacity-75 mt-0.5">Mon-Fri, 2PM-6PM</div>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm opacity-90">
                <Mail size={16} className="mt-0.5 flex-shrink-0" />
                <div>
                  <div>Advertamr@gmail.com</div>
                  <div className="text-xs opacity-75 mt-0.5">We reply within 24 hours</div>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm opacity-90">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <div>
                        Lubaba Mosque
                        <br />
                        Ethiopia Addis Abeba
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-accent/30 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-90">
            <p>&copy; {new Date().getFullYear()} Hira Muslim Students Association. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="#" className="hover:opacity-100 transition-opacity text-xs">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:opacity-100 transition-opacity text-xs">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
