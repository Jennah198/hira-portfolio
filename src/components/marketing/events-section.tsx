"use client"

import { Card } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { Award, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function EventsSection() {
  const graduationImages = [
    "/images/gradwithredgawn.png",
    "/images/certificates.png",
    "/images/graduationPoster.png",
  ]

  const exhibitionImages = [
    "/images/exhibitionStands.png",
    "/images/swExhibition.png",
    "/images/mechExhibition.png",
  ]

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">Our Flagship Events</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join us for transformative events that bring our community together in celebration of achievement and
            knowledge.
          </p>
        </div>

        <div className="space-y-16">
          {/* Graduation Ceremony */}
          <div id="graduation" className="scroll-mt-24">
            <Card className="border-border overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative bg-background">
                  <Carousel className="w-full">
                    <CarouselContent>
                      {graduationImages.map((image, index) => (
                        <CarouselItem key={index}>
                          <div className="relative aspect-[4/3] bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center">
                            <Image
                              src={image}
                              alt={`Graduation Ceremony ${2023 - index}`}
                              width={800}
                              height={600}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-4" />
                    <CarouselNext className="right-4" />
                  </Carousel>
                </div>

                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 text-accent font-semibold mb-4">
                    <Award size={20} />
                    <span>Annual Event</span>
                  </div>
                  <h3 className="text-3xl font-bold text-foreground mb-4">Graduation Ceremony</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Our annual graduation ceremony celebrates the remarkable achievements of our graduating members.
                    This prestigious event honors students who have demonstrated excellence in academics, leadership,
                    and service to the community. Join us in recognizing their dedication as they embark on their next chapter.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button asChild className="bg-accent hover:bg-accent/90">
                      <Link href="/events#graduation">Attend Next Event</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/events/graduation/register">Register Now</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Annual Exhibition */}
          <div id="exhibition" className="scroll-mt-24">
            <Card className="border-border overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="order-2 md:order-1 p-8 md:p-12 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 text-accent font-semibold mb-4">
                    <Award size={20} />
                    <span>Annual Event</span>
                  </div>
                  <h3 className="text-3xl font-bold text-foreground mb-4">Annual Exhibition</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    The Annual Exhibition showcases the creativity, innovation, and scholarly excellence of our student
                    community. This vibrant event features research projects, artistic works, and innovative solutions
                    that demonstrate academic excellence and positive social impact. Explore diverse exhibits spanning 
                    technology, arts, social sciences, and more.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button asChild className="bg-accent hover:bg-accent/90">
                      <Link href="/events#exhibition">Attend Next Event</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/events/exhibition/register">Register Now</Link>
                    </Button>
                  </div>
                </div>

                <div className="order-1 md:order-2 relative bg-background">
                  <Carousel className="w-full">
                    <CarouselContent>
                      {exhibitionImages.map((image, index) => (
                        <CarouselItem key={index}>
                          <div className="relative aspect-[4/3] bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                            <Image
                              src={image}
                              alt={`Annual Exhibition ${2023 - index}`}
                              width={800}
                              height={600}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-4" />
                    <CarouselNext className="right-4" />
                  </Carousel>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}