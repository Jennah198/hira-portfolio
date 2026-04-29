import Image from "next/image"

export function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">About Us</h2>
          <div className="w-24 h-1 bg-accent mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Who We Are</h3>
              <p className="text-muted-foreground leading-relaxed">
                Hira Muslim Students Association is a vibrant community dedicated to empowering students through
                education, service, and Islamic values. Our name, derived from the Cave of Hira where revelation began,
                symbolizes enlightenment and the pursuit of knowledge.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Our Vision & Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                We envision a community of students who excel academically while staying rooted in faith and committed
                to serving humanity. Our mission is to create meaningful opportunities for learning, personal growth,
                and positive societal impact through Islamic principles.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Core Values</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Faith</h4>
                    <p className="text-sm text-muted-foreground">Strengthening our connection with Allah</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Knowledge</h4>
                    <p className="text-sm text-muted-foreground">Pursuing excellence in learning</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Service</h4>
                    <p className="text-sm text-muted-foreground">Giving back to our community</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Excellence</h4>
                    <p className="text-sm text-muted-foreground">Striving for the highest standards</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
            <Image
              src="/diverse-muslim-students-studying-together-with-boo.jpg"
              alt="Students engaged in Islamic learning and study"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
