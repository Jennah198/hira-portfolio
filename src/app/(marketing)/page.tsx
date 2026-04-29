import { Hero } from "@/components/marketing/hero"
import { AboutSection } from "@/components/marketing/about-section"
import { ActivitiesSection } from "@/components/marketing/activities-section"
import { EventsSection } from "@/components/marketing/events-section"
import { MembershipSection } from "@/components/marketing/membership-section"
import { ContactSection } from "@/components/marketing/contact-section"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Hira Muslim Students Association - Knowledge, Service, Excellence",
  description:
    "Empowering students through Islamic values, academic excellence, and community service. Join our community dedicated to knowledge, leadership, and positive change.",
}

export default function HomePage() {
  return (
    <>
      <Hero />

      <AboutSection />

      <ActivitiesSection />

      <EventsSection />

      <MembershipSection />

      <ContactSection />

      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">Ready to Join Our Community?</h2>
          <p className="text-lg opacity-90 mb-8 leading-relaxed">
            Become part of a growing network of students dedicated to knowledge, service, and excellence.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/membership">Apply for Membership</Link>
          </Button>
        </div>
      </section>
    </>
  )
}
