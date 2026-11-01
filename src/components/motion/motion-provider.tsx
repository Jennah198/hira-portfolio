"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

/**
 * Scroll-driven motion, modelled on the agency reference site:
 * - [data-reveal]     fade/slide up once when entering the viewport (IntersectionObserver)
 * - [data-tilt]       3D "arrival" tilt linked to scroll position (desktop, fine pointers only)
 * - [data-parallax=n] translateY at n × scroll while on screen
 * - reading progress bar at the top of the page
 * All of it is skipped under prefers-reduced-motion (see the inline script in app/layout.tsx).
 */
export function MotionProvider() {
  const pathname = usePathname()
  const barRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const root = document.documentElement
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const lightweight = window.matchMedia("(pointer: coarse), (max-width: 768px)").matches
    const clamp = (v: number) => Math.min(1, Math.max(0, v))
    const smooth = (v: number) => v * v * (3 - 2 * v)

    let pending = false

    // Cached element lists (refreshed when the DOM changes, not on every scroll frame)
    let parallaxEls: HTMLElement[] = []
    let tiltEls: HTMLElement[] = []
    const collect = () => {
      parallaxEls = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"))
      tiltEls = lightweight ? [] : Array.from(document.querySelectorAll<HTMLElement>("[data-tilt]"))
    }
    collect()

    // Reveal ---------------------------------------------------------------
    let io: IntersectionObserver | null = null
    let mo: MutationObserver | null = null
    if (!reduced && "IntersectionObserver" in window) {
      root.classList.add("motion-ready")
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible")
              io?.unobserve(entry.target)
            }
          }
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
      )
      let queued = false
      const observeAll = () => {
        queued = false
        document.querySelectorAll("[data-reveal]:not(.is-visible)").forEach((el) => io?.observe(el))
        collect()
        onScroll()
      }
      observeAll()
      mo = new MutationObserver(() => {
        if (!queued) {
          queued = true
          requestAnimationFrame(observeAll)
        }
      })
      mo.observe(document.body, { childList: true, subtree: true })
    } else {
      root.classList.remove("motion-ready")
    }

    // Scroll-linked effects -------------------------------------------------
    function update() {
      pending = false
      const viewport = window.innerHeight
      const max = Math.max(1, root.scrollHeight - viewport)
      if (barRef.current) barRef.current.style.transform = `scaleX(${clamp(window.scrollY / max)})`
      if (reduced) return

      parallaxEls.forEach((el) => {
        const speed = Number(el.dataset.parallax) || 0
        const rect = el.parentElement?.getBoundingClientRect()
        if (!rect || rect.bottom < 0 || rect.top > viewport) return
        el.style.transform = `translate3d(0, ${Math.max(0, -rect.top) * speed}px, 0)`
      })

      if (lightweight) return
      const rects = tiltEls.map((el) => (el.parentElement ?? el).getBoundingClientRect())
      tiltEls.forEach((el, i) => {
        const rect = rects[i]
        if (rect.top > viewport * 1.2 || rect.bottom < -100) return
        const arrival = smooth(clamp((viewport * 0.95 - rect.top) / (viewport * 0.6)))
        const remaining = 1 - arrival
        const direction = Number(el.dataset.tilt) || (i % 2 ? 1 : -1)
        el.style.setProperty("--tilt-lift", `${remaining * 60}px`)
        el.style.setProperty("--tilt-rx", `${remaining * 12}deg`)
        el.style.setProperty("--tilt-ry", `${remaining * direction * 8}deg`)
        el.style.setProperty("--tilt-scale", String(1 - remaining * 0.05))
      })
    }
    function onScroll() {
      if (!pending) {
        pending = true
        requestAnimationFrame(update)
      }
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)

    return () => {
      io?.disconnect()
      mo?.disconnect()
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [pathname])

  return (
    <div className="reading-progress" aria-hidden>
      <span ref={barRef} />
    </div>
  )
}

/** Inline, pre-paint script: enables reveal styles only when JS runs and motion is allowed. */
export const motionBootScript = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&'IntersectionObserver' in window){document.documentElement.classList.add('motion-ready')}}catch(e){}`
