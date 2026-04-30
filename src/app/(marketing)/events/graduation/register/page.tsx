"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function GraduationRegistrationPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    schoolName: "",
    phone: "",
    telegram: "",
    faydaId: "",
    email: "",
    address: "",
    paymentReceiptUrl: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "graduation-registration",
          payload: formData,
        }),
      })
      if (!res.ok) throw new Error("Could not submit registration")
      toast({ title: "Registration submitted", description: "We received your graduation registration." })
      setFormData({
        fullName: "",
        schoolName: "",
        phone: "",
        telegram: "",
        faydaId: "",
        email: "",
        address: "",
        paymentReceiptUrl: "",
      })
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
            <h1 className="text-3xl font-bold">Graduation Registration</h1>
            <p className="text-sm text-muted-foreground">
              Payment Account Number: <span className="font-semibold">1000 2000 3000 4000</span>
            </p>
            <p className="text-xs text-muted-foreground">Copy this account number and use it when sending payment.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input id="fullName" required value={formData.fullName} onChange={(e) => setFormData((p) => ({ ...p, fullName: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="schoolName">School Name *</Label>
                <Input id="schoolName" required value={formData.schoolName} onChange={(e) => setFormData((p) => ({ ...p, schoolName: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" type="tel" required value={formData.phone} onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telegram">Telegram Username *</Label>
                <Input id="telegram" required value={formData.telegram} onChange={(e) => setFormData((p) => ({ ...p, telegram: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="faydaId">ID Card (Fayda) *</Label>
                <Input id="faydaId" required value={formData.faydaId} onChange={(e) => setFormData((p) => ({ ...p, faydaId: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input id="address" required value={formData.address} onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentReceiptUrl">Payment Receipt Screenshot (Optional URL)</Label>
                <Input id="paymentReceiptUrl" value={formData.paymentReceiptUrl} onChange={(e) => setFormData((p) => ({ ...p, paymentReceiptUrl: e.target.value }))} />
              </div>
              <p className="text-sm text-muted-foreground">Need additional information? Call: +251 96 452 1722</p>
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
