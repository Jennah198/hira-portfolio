import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Award, BookOpen, Calendar, Users, MapPin } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Events - Hira Muslim Students Association",
  description:
    "Discover our signature events including the annual Graduation Ceremony and Exhibition that celebrate student achievements and showcase community impact.",
}

export default function EventsPage() {
  return (
    <main>
        <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">Our Events</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Discover our signature events that bring together students, celebrate achievements, and showcase the
                impact of our community.
              </p>
            </div>
          </div>
        </section>

        <section id="graduation" className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="inline-flex items-center gap-2 bg-accent/20 text-accent-foreground px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <Award size={16} />
                  <span>Annual Celebration</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-balance">
                  Graduation Ceremony
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Our annual graduation ceremony is a momentous occasion where we honor the achievements of our
                  graduating members. This prestigious event celebrates not only academic success but also the personal
                  growth, leadership, and community contributions of our students.
                </p>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Calendar className="text-primary mt-1 flex-shrink-0" size={20} />
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">When</h4>
                      <p className="text-sm text-muted-foreground">Held annually at the end of the academic year</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="text-primary mt-1 flex-shrink-0" size={20} />
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Where</h4>
                      <p className="text-sm text-muted-foreground">Different well known halls</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="text-primary mt-1 flex-shrink-0" size={20} />
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Who Attends</h4>
                      <p className="text-sm text-muted-foreground">
                        Graduates, families, scholars, and association members
                      </p>
                    </div>
                  </div>
                </div>
                <Button asChild size="lg" aria-label="Register for graduation event">
                  <Link href="/events/graduation/register">Register for Next Event</Link>
                </Button>
              </div>
              <div className="order-1 md:order-2">
                <Card className="border-border overflow-hidden">
                  <div className="relative h-64 bg-gradient-to-br from-accent to-accent/60">
                    <img
                      src="/images/gradwithredgawn.png"
                      alt="Graduation ceremony"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-3 text-card-foreground">Event Highlights</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-1">•</span>
                        <span>Formal graduation procession and certificate presentation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-1">•</span>
                        <span>Inspirational speeches from distinguished guests</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-1">•</span>
                        <span>Recognition of outstanding achievements and contributions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-1">•</span>
                        <span>Reception and networking opportunities</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* <div className="mt-12 grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[2024, 2023, 2022, 2021].map((year) => (
                <Card key={year} className="border-border overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-40 bg-muted">
                    <img
                      src={`/graduation-.jpg?height=200&width=300&query=graduation+${year}`}
                      alt={`Graduation ${year}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-foreground">Class of {year}</h4>
                    <p className="text-sm text-muted-foreground mt-1">View gallery</p>
                  </CardContent>
                </Card>
              ))}
            </div> */}
          </div>
        </section>

        <section id="exhibition" className="py-16 md:py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Card className="border-border overflow-hidden">
                  <div className="relative h-64 bg-gradient-to-br from-primary/20 to-primary/10">
                    <img
                      src="/images/exhibitionStands.png"
                      alt="Annual exhibition"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-3 text-card-foreground">Exhibition Features</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Student research presentations and academic projects</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Creative works and innovative solutions showcase</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Interactive workshops and skill-building sessions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Networking with industry professionals and alumni</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              <div>
                <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <BookOpen size={16} />
                  <span>Annual Showcase</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-balance">Annual Exhibition</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Our Annual Exhibition is a vibrant showcase of student talent, innovation, and creativity. This event
                  provides a platform for members to present their academic projects, research findings, and creative
                  endeavors to the wider university community and beyond.
                </p>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Calendar className="text-primary mt-1 flex-shrink-0" size={20} />
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">When</h4>
                      <p className="text-sm text-muted-foreground">Summer Break, typically in August</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="text-primary mt-1 flex-shrink-0" size={20} />
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Where</h4>
                      <p className="text-sm text-muted-foreground">Awolia Hall</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="text-primary mt-1 flex-shrink-0" size={20} />
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Open To</h4>
                      <p className="text-sm text-muted-foreground">
                        Students, faculty, industry partners, and the public
                      </p>
                    </div>
                  </div>
                </div>
                <Button asChild size="lg" aria-label="Register for exhibition">
                  <Link href="/events/exhibition/register">Submit Your Project</Link>
                </Button>
              </div>
            </div>

            {/* <div className="mt-12 grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[2024, 2023, 2022, 2021].map((year) => (
                <Card key={year} className="border-border overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-40 bg-muted">
                    <img
                      src={`/exhibition-.jpg?height=200&width=300&query=exhibition+${year}`}
                      alt={`Exhibition ${year}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-foreground">{year} Exhibition</h4>
                    <p className="text-sm text-muted-foreground mt-1">View projects</p>
                  </CardContent>
                </Card>
              ))}
            </div> */}
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-balance">Impact Summary</h2>
            <div className="grid sm:grid-cols-3 gap-8 mt-12">
              <div>
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">500+</div>
                <div className="text-muted-foreground">Graduates</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">15+</div>
                <div className="text-muted-foreground">Projects Showcased</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">6+</div>
                <div className="text-muted-foreground">Years of Excellence</div>
              </div>
            </div>
          </div>
        </section>
    </main>
  )
}
