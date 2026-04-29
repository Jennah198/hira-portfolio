"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Facebook, Instagram, Send } from "lucide-react"
import { useState } from "react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Contact form submitted:", formData)
    // Handle form submission
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <main>
        <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">Get In Touch</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Have questions or want to learn more about Hira? We'd love to hear from you.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">Contact Information</h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Reach out to us through any of the following channels. Our team is here to answer your questions and
                  help you get involved.
                </p>

                <div className="space-y-6">
                  <Card className="border-border">
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                        <Mail className="text-accent-foreground" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-card-foreground mb-1">Email</h3>
                        <p className="text-sm text-muted-foreground">info@hiramsa.org</p>
                        <p className="text-sm text-muted-foreground">president@hiramsa.org</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                        <Phone className="text-accent-foreground" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-card-foreground mb-1">Phone</h3>
                        <p className="text-sm text-muted-foreground">+251 91 234 5678</p>
                        <p className="text-sm text-muted-foreground">+251 92 345 6789</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                        <MapPin className="text-accent-foreground" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-card-foreground mb-1">Office Location</h3>
                        <p className="text-sm text-muted-foreground">
                          Student Union Building, Room 205
                          <br />
                          University Campus
                          <br />
                          Addis Ababa, Ethiopia
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <div>
                    <h3 className="font-semibold text-foreground mb-4">Follow Us</h3>
                    <div className="flex items-center gap-4">
                      <a
                        href="#"
                        className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center hover:bg-accent/80 transition-colors"
                        aria-label="Facebook"
                      >
                        <Facebook className="text-accent-foreground" size={24} />
                      </a>
                      <a
                        href="#"
                        className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center hover:bg-accent/80 transition-colors"
                        aria-label="Instagram"
                      >
                        <Instagram className="text-accent-foreground" size={24} />
                      </a>
                      <a
                        href="#"
                        className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center hover:bg-accent/80 transition-colors"
                        aria-label="Telegram"
                      >
                        <Send className="text-accent-foreground" size={24} />
                      </a>
                    </div>
                  </div>
                </div>

                <Card className="mt-8 border-border bg-muted/30">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-card-foreground mb-3">Office Hours</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Monday - Thursday</span>
                        <span className="font-medium text-foreground">2:00 PM - 6:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Friday</span>
                        <span className="font-medium text-foreground">10:00 AM - 2:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Weekend</span>
                        <span className="font-medium text-foreground">Closed</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="border-border">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-card-foreground mb-6">Send Us a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Your full name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="your.email@example.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          placeholder="What is this regarding?"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          placeholder="Write your message here..."
                          rows={6}
                        />
                      </div>

                      <Button type="submit" size="lg" className="w-full">
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <div className="mt-8">
                  <Card className="border-border overflow-hidden">
                    <div className="relative h-64 bg-muted">
                      <img
                        src="/university-campus-map.jpg"
                        alt="Campus location map"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
    </main>
  )
}
