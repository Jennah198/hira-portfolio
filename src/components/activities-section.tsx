"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Heart, BookOpen, TreePine, Users, Lightbulb, HandHeart } from "lucide-react"
import Image from "next/image"

const activities = [
  {
    icon: Heart,
    title: "Charity & Community Service",
    description:
      "Supporting those in need through fundraising, donations, and community outreach programs that make a real difference.",
    image: "/charity-community-service-volunteers.jpg",
  },
  {
    icon: TreePine,
    title: "Tree Planting Initiatives",
    description:
      "Environmental stewardship through organized tree planting campaigns to preserve nature and combat climate change.",
    image: "/tree-planting-environmental-conservation.jpg",
  },
  {
    icon: BookOpen,
    title: "Educational Study Circles",
    description:
      "Weekly study groups exploring Islamic knowledge, academic excellence, and personal development through collaborative learning.",
    image: "/students-studying-books-islamic-learning.jpg",
  },
  {
    icon: Users,
    title: "Social Development Programs",
    description:
      "Building brotherhood and sisterhood through mentorship, leadership training, and community-building activities.",
    image: "/diverse-students-community-gathering.jpg",
  },
  {
    icon: Lightbulb,
    title: "Leadership Workshops",
    description:
      "Empowering students with skills in public speaking, project management, and ethical leadership rooted in Islamic values.",
    image: "/leadership-workshop-presentation.jpg",
  },
  {
    icon: HandHeart,
    title: "Interfaith Dialogue",
    description:
      "Promoting understanding and cooperation through respectful conversations with people of all faiths and backgrounds.",
    image: "/interfaith-dialogue-peaceful-discussion.jpg",
  },
]

export function ActivitiesSection() {
  return (
    <section id="activities" className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Our Activities & Initiatives
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto mb-6" />
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We engage in diverse initiatives that strengthen our community, serve those in need, and create lasting
            positive impact.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((activity, index) => {
            const Icon = activity.icon
            return (
              <Card
                key={index}
                className="border-border overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden bg-muted">
                  <Image
                    src={activity.image || "/placeholder.svg"}
                    alt={activity.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 w-12 h-12 rounded-lg bg-accent flex items-center justify-center shadow-lg">
                    <Icon className="text-accent-foreground" size={24} />
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-3 text-card-foreground">{activity.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{activity.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
