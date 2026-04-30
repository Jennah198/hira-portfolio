import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-[oklch(0.25_0.08_260)] via-[oklch(0.22_0.07_265)] to-[oklch(0.18_0.06_270)] dark:from-[oklch(0.15_0.04_260)] dark:via-[oklch(0.12_0.05_265)] dark:to-[oklch(0.10_0.06_270)]">
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="geometric" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path
                d="M50 0 L75 25 L75 75 L50 100 L25 75 L25 25 Z M0 50 L25 25 L25 75 L0 100 M100 50 L75 25 L75 75 L100 100 M50 0 L25 25 M50 0 L75 25 M50 100 L25 75 M50 100 L75 75"
                stroke="currentColor"
                strokeWidth="0.5"
                fill="none"
                className="text-accent"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#geometric)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 lg:py-40">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 text-balance leading-tight">
            Illuminating Minds, <span className="text-accent bg-accent/10 px-2 rounded">Empowering Leaders</span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-10 leading-relaxed max-w-3xl mx-auto">
            Hira Muslim Students Association cultivates excellence through Islamic values, academic achievement, and
            transformative community service.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/membership">Become a Member</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 hover:text-white bg-black/30"
            >
              <Link href="#activities">Explore Our Activities</Link>
            </Button>
          </div>

          <div className="mt-16 flex justify-center">
            <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
              <div className="w-1.5 h-3 bg-accent rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
