"use client"

import type React from "react"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field } from "@/components/forms/field"
import { Honeypot } from "@/components/forms/honeypot"
import { ArrowForward } from "@/components/shared/accent"
import { useI18n } from "@/i18n/client"
import { getSubmissionErrorMessage, toastSubmissionError, toastSubmissionSuccess } from "@/lib/submission-toasts"

const EMPTY = { fullName: "", schoolName: "", phone: "", telegram: "", faydaId: "", email: "", address: "" }

export function GraduationForm() {
  const { t } = useI18n()
  const f = t.graduationForm
  const receiptInputRef = useRef<HTMLInputElement>(null)
  const hpRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [receiptResetKey, setReceiptResetKey] = useState(0)
  const [formData, setFormData] = useState(EMPTY)

  const set = (key: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((p) => ({ ...p, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const fd = new FormData()
      fd.append("full_name", formData.fullName.trim())
      fd.append("school_name", formData.schoolName.trim())
      fd.append("phone_number", formData.phone.trim())
      fd.append("telegram_username", formData.telegram.trim())
      if (formData.faydaId.trim()) fd.append("id_card_number", formData.faydaId.trim())
      if (formData.email.trim()) fd.append("email", formData.email.trim())
      fd.append("address", formData.address.trim())
      fd.append("website", hpRef.current?.value ?? "")

      const receiptFile = receiptInputRef.current?.files?.[0]
      if (receiptFile && receiptFile.size > 0) fd.append("receipt", receiptFile)

      const res = await fetch("/api/graduation", { method: "POST", body: fd })
      const payload = await res.json().catch(() => null)
      if (!res.ok) {
        toastSubmissionError(getSubmissionErrorMessage(payload, f.error))
        return
      }
      toastSubmissionSuccess(t.common.successToast)
      setFormData(EMPTY)
      setReceiptResetKey((k) => k + 1)
    } catch {
      toastSubmissionError(t.common.errorToast)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative space-y-5">
      <Honeypot ref={hpRef} />
      <Field id="fullName" label={f.fullName} required>
        <Input id="fullName" required value={formData.fullName} onChange={set("fullName")} autoComplete="name" />
      </Field>
      <Field id="schoolName" label={f.schoolName} required>
        <Input id="schoolName" required value={formData.schoolName} onChange={set("schoolName")} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="phone" label={f.phone} required>
          <Input id="phone" type="tel" dir="ltr" required value={formData.phone} onChange={set("phone")} autoComplete="tel" />
        </Field>
        <Field id="telegram" label={f.telegram} required>
          <Input id="telegram" dir="ltr" required value={formData.telegram} onChange={set("telegram")} placeholder="@username" />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="faydaId" label={f.fayda} optionalLabel={t.common.optional}>
          <Input id="faydaId" dir="ltr" value={formData.faydaId} onChange={set("faydaId")} />
        </Field>
        <Field id="email" label={f.email} optionalLabel={t.common.optional}>
          <Input id="email" type="email" dir="ltr" value={formData.email} onChange={set("email")} autoComplete="email" />
        </Field>
      </div>
      <Field id="address" label={f.address} required>
        <Input id="address" required value={formData.address} onChange={set("address")} autoComplete="street-address" />
      </Field>
      <Field id="graduation-receipt-upload" label={f.receipt} required hint={f.receiptHelp}>
        <Input
          key={receiptResetKey}
          ref={receiptInputRef}
          id="graduation-receipt-upload"
          type="file"
          required
          accept="image/jpeg,image/png,image/webp,application/pdf"
          className="cursor-pointer"
        />
      </Field>
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? t.common.submitting : f.submit}
        {!isSubmitting ? <ArrowForward /> : null}
      </Button>
    </form>
  )
}
