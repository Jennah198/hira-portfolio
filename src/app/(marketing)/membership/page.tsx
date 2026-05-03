"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2 } from "lucide-react"
import { useState } from "react"
import {
  getSubmissionErrorMessage,
  toastSubmissionError,
  toastSubmissionSuccess,
} from "@/lib/submission-toasts"

export default function MembershipPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    studentId: "",
    program: "",
    year: "",
    motivation: "",
    areaOfInterest: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "membership-application", payload: formData }),
      })
      const payload = await res.json().catch(() => null)
      if (!res.ok) {
        toastSubmissionError(getSubmissionErrorMessage(payload, "Could not submit application"))
        return
      }
      toastSubmissionSuccess()
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        studentId: "",
        program: "",
        year: "",
        motivation: "",
        areaOfInterest: "",
      })
    } catch (error) {
      toastSubmissionError(error instanceof Error ? error.message : "Please try again.")
    } finally {
      setIsSubmitting(false)
    }
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
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">Join Hira</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Become part of a community dedicated to knowledge, service, and excellence. Membership is open to all
                students who share our values.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">Membership Benefits</h2>
                <div className="space-y-4">
                  {[
                    "Access to exclusive workshops and seminars",
                    "Networking opportunities with alumni and professionals",
                    "Leadership development programs",
                    "Participation in community service initiatives",
                    "Academic support and mentorship",
                    "Priority registration for events",
                    "Certificate of membership and graduation recognition",
                    "Voting rights in association decisions",
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="text-accent flex-shrink-0 mt-0.5" size={20} />
                      <span className="text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>

                <Card className="mt-8 border-border">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-3 text-card-foreground">Requirements</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Current enrollment at the school or university</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Commitment to association values and activities</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Active participation in at least two events per semester</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Payment of annual membership fee (if applicable)</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="border-border">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-card-foreground mb-6">Application Form</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="your.email@university.edu"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          placeholder="+251 91 234 5678"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="studentId">Student ID *</Label>
                        <Input
                          id="studentId"
                          name="studentId"
                          value={formData.studentId}
                          onChange={handleChange}
                          required
                          placeholder="Enter your student ID"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="program">Program of Study *</Label>
                        <Input
                          id="program"
                          name="program"
                          value={formData.program}
                          onChange={handleChange}
                          required
                          placeholder="e.g., Computer Science, High School"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="year">Year of Study *</Label>
                        <Input
                          id="year"
                          name="year"
                          value={formData.year}
                          onChange={handleChange}
                          required
                          placeholder="e.g., 2nd Year or grade 11"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="areaOfInterest">Area of Interest *</Label>
                        <Select
                          value={formData.areaOfInterest}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, areaOfInterest: value }))}
                          required
                        >
                          <SelectTrigger id="areaOfInterest">
                            <SelectValue placeholder="Select your area of interest" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="education">Educational Programs</SelectItem>
                            <SelectItem value="charity">Charity & Community Service</SelectItem>
                            <SelectItem value="leadership">Leadership Development</SelectItem>
                            <SelectItem value="social">Social & Spiritual Events</SelectItem>
                            <SelectItem value="spiritual">Spiritual Growth</SelectItem>
                            <SelectItem value="environmental">Environmental Initiatives</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="motivation">Why do you want to join Hira? *</Label>
                        <Textarea
                          id="motivation"
                          name="motivation"
                          value={formData.motivation}
                          onChange={handleChange}
                          required
                          placeholder="Share your motivation and what you hope to contribute..."
                          rows={4}
                        />
                      </div>

                      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit Application"}
                      </Button>

                      <p className="text-xs text-muted-foreground text-center">
                        By submitting this form, you agree to our terms and conditions.
                      </p>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
    </main>
  )
}
