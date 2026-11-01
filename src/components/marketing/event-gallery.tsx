"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import { useI18n } from "@/i18n/client"

export function EventGallery({ images, alt }: { images: string[]; alt: string }) {
  const { dir } = useI18n()
  const [api, setApi] = useState<CarouselApi>()

  useEffect(() => {
    if (!api || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const timer = setInterval(() => api.scrollNext(), 4500)
    return () => clearInterval(timer)
  }, [api])

  return (
    <Carousel className="w-full" setApi={setApi} opts={{ loop: true, direction: dir }} dir={dir}>
      <CarouselContent>
        {images.map((src, i) => (
          <CarouselItem key={src}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image src={src} alt={`${alt} ${i + 1}`} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="start-4 glass-photo border-0 text-white hover:bg-white/25 rtl:[&_svg]:-scale-x-100" />
      <CarouselNext className="end-4 glass-photo border-0 text-white hover:bg-white/25 rtl:[&_svg]:-scale-x-100" />
    </Carousel>
  )
}
