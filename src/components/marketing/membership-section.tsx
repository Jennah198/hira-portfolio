"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, Users, Rocket, Award } from "lucide-react"
import { useState } from "react"
import {
  getSubmissionErrorMessage,
  toastSubmissionError,
  toastSubmissionSuccess,
} from "@/lib/submission-toasts"

export function MembershipSection() {
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

  async function onSubmit(e: React.FormEvent) {
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

  return (
    <section id="membership" className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Become a Member</h2>
          <div className="w-24 h-1 bg-accent mx-auto mb-6" />
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join a community of dedicated students committed to excellence, service, and personal growth through Islamic
            values.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left: Benefits and Information */}
          <div className="space-y-8">
            {/* Benefits */}
            <div>
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Award className="size-6 text-accent" />
                Membership Benefits
              </h3>
              <div className="space-y-4">
                {[
                  "Access to exclusive educational workshops and study circles",
                  "Networking opportunities with like-minded students",
                  "Leadership development programs",
                  "Participation in community service initiatives",
                  "Spiritual growth through guided Islamic learning",
                  "Career guidance and mentorship programs",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="size-5 text-accent shrink-0 mt-0.5" />
                    <p className="text-muted-foreground leading-relaxed">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Eligibility */}
            <div>
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Users className="size-6 text-accent" />
                Who Can Join?
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Hira Muslim Students Association welcomes all students who share our commitment to:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-accent font-semibold">•</span>
                  <span>Pursuing academic excellence with Islamic principles</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent font-semibold">•</span>
                  <span>Serving the community with dedication and compassion</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent font-semibold">•</span>
                  <span>Growing spiritually and intellectually</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent font-semibold">•</span>
                  <span>Building positive relationships and fostering unity</span>
                </li>
              </ul>
            </div>

            {/* Opportunities */}
            <div>
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Rocket className="size-6 text-accent" />
                Opportunities & Responsibilities
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Members have the opportunity to lead projects, organize events, participate in charitable initiatives,
                and represent Hira at schools and community functions. We expect active participation, commitment to
                our values, and contribution to our collective mission of knowledge and service.
              </p>
            </div>
          </div>

          {/* Right: Registration Form */}
          <Card className="border-2">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-semibold mb-6 text-center">Application Form</h3>
              <form onSubmit={onSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="member-full-name">Full Name *</Label>
                  <Input
                    id="member-full-name"
                    value={formData.fullName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="member-email">Email Address *</Label>
                  <Input
                    id="member-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="member-phone">Phone Number *</Label>
                  <Input
                    id="member-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="member-student-id">Student ID *</Label>
                  <Input
                    id="member-student-id"
                    value={formData.studentId}
                    onChange={(e) => setFormData((prev) => ({ ...prev, studentId: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="member-program">Program of Study *</Label>
                  <Input
                    id="member-program"
                    value={formData.program}
                    onChange={(e) => setFormData((prev) => ({ ...prev, program: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="member-year">Year of Study *</Label>
                  <Input
                    id="member-year"
                    value={formData.year}
                    onChange={(e) => setFormData((prev) => ({ ...prev, year: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="member-area-interest">Area of Interest *</Label>
                  <Select
                    value={formData.areaOfInterest}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, areaOfInterest: value }))}
                    required
                  >
                    <SelectTrigger id="member-area-interest">
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
                  <Label htmlFor="member-motivation">Why do you want to join Hira? *</Label>
                  <Textarea
                    id="member-motivation"
                    rows={4}
                    value={formData.motivation}
                    onChange={(e) => setFormData((prev) => ({ ...prev, motivation: e.target.value }))}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting} aria-label="Submit member application">
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
