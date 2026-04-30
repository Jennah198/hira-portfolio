"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

type Mode = "facilitator" | "guest-company"

export default function ExhibitionRegistrationPage() {
  const { toast } = useToast()
  const [mode, setMode] = useState<Mode>("facilitator")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [facilitator, setFacilitator] = useState({
    fullName: "",
    email: "",
    phone: "",
    programOfStudy: "",
    projectName: "",
    projectExplanation: "",
    mvpDemoFileName: "",
  })
  const [company, setCompany] = useState({
    companyName: "",
    ownerFullName: "",
    email: "",
    phone: "",
    businessType: "",
    interestedArea: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const payload = mode === "facilitator" ? facilitator : company
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: mode === "facilitator" ? "exhibition-facilitator" : "exhibition-guest-company",
          payload,
        }),
      })
      if (!res.ok) throw new Error("Could not submit registration")
      toast({ title: "Registration submitted", description: "We received your exhibition registration." })
    } catch (error) {
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="p-6 md:p-8 space-y-6">
            <h1 className="text-3xl font-bold">Exhibition Registration</h1>
            <div className="grid sm:grid-cols-2 gap-3">
              <Button variant={mode === "facilitator" ? "default" : "outline"} onClick={() => setMode("facilitator")}>
                Register as Program Facilitator / Exhibitor
              </Button>
              <Button variant={mode === "guest-company" ? "default" : "outline"} onClick={() => setMode("guest-company")}>
                Register as Guest / Company Owner
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "facilitator" ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="facilitator-name">Full Name *</Label>
                    <Input id="facilitator-name" required value={facilitator.fullName} onChange={(e) => setFacilitator((p) => ({ ...p, fullName: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facilitator-email">Email (Optional)</Label>
                    <Input id="facilitator-email" type="email" value={facilitator.email} onChange={(e) => setFacilitator((p) => ({ ...p, email: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facilitator-phone">Phone Number *</Label>
                    <Input id="facilitator-phone" type="tel" required value={facilitator.phone} onChange={(e) => setFacilitator((p) => ({ ...p, phone: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facilitator-program">Program of Study *</Label>
                    <Input id="facilitator-program" required value={facilitator.programOfStudy} onChange={(e) => setFacilitator((p) => ({ ...p, programOfStudy: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facilitator-project">Name of the Project *</Label>
                    <Input id="facilitator-project" required value={facilitator.projectName} onChange={(e) => setFacilitator((p) => ({ ...p, projectName: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facilitator-explanation">Short Project Explanation *</Label>
                    <Textarea id="facilitator-explanation" required value={facilitator.projectExplanation} onChange={(e) => setFacilitator((p) => ({ ...p, projectExplanation: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facilitator-mvp">Upload MVP / Demo *</Label>
                    <Input
                      id="facilitator-mvp"
                      type="file"
                      required
                      onChange={(e) =>
                        setFacilitator((p) => ({
                          ...p,
                          mvpDemoFileName: e.target.files?.[0]?.name ?? "",
                        }))
                      }
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name *</Label>
                    <Input id="company-name" required value={company.companyName} onChange={(e) => setCompany((p) => ({ ...p, companyName: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="owner-name">Owner Full Name *</Label>
                    <Input id="owner-name" required value={company.ownerFullName} onChange={(e) => setCompany((p) => ({ ...p, ownerFullName: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-email">Email (Optional)</Label>
                    <Input id="company-email" type="email" value={company.email} onChange={(e) => setCompany((p) => ({ ...p, email: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-phone">Phone Number *</Label>
                    <Input id="company-phone" type="tel" required value={company.phone} onChange={(e) => setCompany((p) => ({ ...p, phone: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business-type">Business Type *</Label>
                    <Input id="business-type" required value={company.businessType} onChange={(e) => setCompany((p) => ({ ...p, businessType: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interested-area">Area of Interest *</Label>
                    <Textarea id="interested-area" required value={company.interestedArea} onChange={(e) => setCompany((p) => ({ ...p, interestedArea: e.target.value }))} />
                  </div>
                </>
              )}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Registration"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
