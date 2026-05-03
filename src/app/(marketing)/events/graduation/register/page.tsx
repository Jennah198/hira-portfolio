"use client"

import type React from "react"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  getSubmissionErrorMessage,
  toastSubmissionError,
  toastSubmissionSuccess,
} from "@/lib/submission-toasts"

export default function GraduationRegistrationPage() {
  const receiptInputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [receiptResetKey, setReceiptResetKey] = useState(0)
  const [formData, setFormData] = useState({
    fullName: "",
    schoolName: "",
    phone: "",
    telegram: "",
    faydaId: "",
    email: "",
    address: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const fd = new FormData()
      fd.append("full_name", formData.fullName.trim())
      fd.append("school_name", formData.schoolName.trim())
      fd.append("phone_number", formData.phone.trim())
      fd.append("telegram_username", formData.telegram.trim())
      if (formData.faydaId.trim()) {
        fd.append("id_card_number", formData.faydaId.trim())
      }
      if (formData.email.trim()) {
        fd.append("email", formData.email.trim())
      }
      fd.append("address", formData.address.trim())

      const receiptFile = receiptInputRef.current?.files?.[0]
      if (receiptFile && receiptFile.size > 0) {
        fd.append("receipt", receiptFile)
      }

      const res = await fetch("/api/graduation", {
        method: "POST",
        body: fd,
      })

      const payload = await res.json().catch(() => null)
      if (!res.ok) {
        toastSubmissionError(getSubmissionErrorMessage(payload, "Could not submit registration"))
        return
      }
      toastSubmissionSuccess()
      setFormData({
        fullName: "",
        schoolName: "",
        phone: "",
        telegram: "",
        faydaId: "",
        email: "",
        address: "",
      })
      setReceiptResetKey((k) => k + 1)
    } catch (error) {
      toastSubmissionError(error instanceof Error ? error.message : "Please try again.")
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
                <Label htmlFor="faydaId">ID Card (Fayda) (optional)</Label>
                <Input id="faydaId" value={formData.faydaId} onChange={(e) => setFormData((p) => ({ ...p, faydaId: e.target.value }))} />
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
                <Label htmlFor="graduation-receipt-upload">Payment receipt (screenshot or PDF, optional)</Label>
                <Input
                  key={receiptResetKey}
                  ref={receiptInputRef}
                  id="graduation-receipt-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">Max 10 MB. Images or PDF.</p>
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
