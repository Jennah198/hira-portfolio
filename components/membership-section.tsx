"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, Users, Rocket, Award } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  university: z.string().min(2, "Please enter your university or department"),
  areaOfInterest: z.string().min(1, "Please select an area of interest"),
})

export function MembershipSection() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      university: "",
      areaOfInterest: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    // Handle form submission
    alert("Thank you for your interest! We will contact you soon.")
    form.reset()
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
                and represent Hira at university and community functions. We expect active participation, commitment to
                our values, and contribution to our collective mission of knowledge and service.
              </p>
            </div>
          </div>

          {/* Right: Registration Form */}
          <Card className="border-2">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-semibold mb-6 text-center">Registration Form</h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john.doe@university.edu" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+1 (555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="university"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>University / Department</FormLabel>
                        <FormControl>
                          <Input placeholder="University Name or Department" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="areaOfInterest"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Area of Interest</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your area of interest" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="education">Educational Programs</SelectItem>
                            <SelectItem value="charity">Charity & Community Service</SelectItem>
                            <SelectItem value="leadership">Leadership Development</SelectItem>
                            <SelectItem value="social">Social & Cultural Events</SelectItem>
                            <SelectItem value="spiritual">Spiritual Growth</SelectItem>
                            <SelectItem value="environmental">Environmental Initiatives</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" size="lg">
                    Submit Application
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
