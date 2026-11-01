"use client"

import type React from "react"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Field } from "@/components/forms/field"
import { Honeypot } from "@/components/forms/honeypot"
import { ArrowForward } from "@/components/shared/accent"
import { useI18n } from "@/i18n/client"
import { getSubmissionErrorMessage, toastSubmissionError, toastSubmissionSuccess } from "@/lib/submission-toasts"

const EMPTY = {
  fullName: "",
  email: "",
  phone: "",
  studentId: "",
  program: "",
  year: "",
  motivation: "",
  areaOfInterest: "",
}

const INTEREST_KEYS = ["education", "charity", "leadership", "social", "spiritual", "environmental"] as const

export function MembershipForm() {
  const { t } = useI18n()
  const f = t.membership.form
  const hpRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState(EMPTY)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "membership-application", payload: formData, website: hpRef.current?.value ?? "" }),
      })
      const payload = await res.json().catch(() => null)
      if (!res.ok) {
        toastSubmissionError(getSubmissionErrorMessage(payload, f.error))
        return
      }
      toastSubmissionSuccess(t.common.successToast)
      setFormData(EMPTY)
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
        <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder={f.fullNamePh} autoComplete="name" />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="email" label={f.email} required>
          <Input id="email" name="email" type="email" dir="ltr" value={formData.email} onChange={handleChange} required placeholder={f.emailPh} autoComplete="email" />
        </Field>
        <Field id="phone" label={f.phone} required>
          <Input id="phone" name="phone" type="tel" dir="ltr" value={formData.phone} onChange={handleChange} required placeholder={f.phonePh} autoComplete="tel" />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="studentId" label={f.studentId} required>
          <Input id="studentId" name="studentId" value={formData.studentId} onChange={handleChange} required placeholder={f.studentIdPh} />
        </Field>
        <Field id="year" label={f.year} required>
          <Input id="year" name="year" value={formData.year} onChange={handleChange} required placeholder={f.yearPh} />
        </Field>
      </div>
      <Field id="program" label={f.program} required>
        <Input id="program" name="program" value={formData.program} onChange={handleChange} required placeholder={f.programPh} />
      </Field>
      <Field id="areaOfInterest" label={f.interest} required>
        <Select
          value={formData.areaOfInterest}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, areaOfInterest: value }))}
          required
        >
          <SelectTrigger id="areaOfInterest" className="w-full">
            <SelectValue placeholder={f.interestPh} />
          </SelectTrigger>
          <SelectContent>
            {INTEREST_KEYS.map((key) => (
              <SelectItem key={key} value={key}>
                {f.interests[key]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field id="motivation" label={f.motivation} required>
        <Textarea id="motivation" name="motivation" value={formData.motivation} onChange={handleChange} required placeholder={f.motivationPh} rows={4} />
      </Field>
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? t.common.submitting : f.submit}
        {!isSubmitting ? <ArrowForward /> : null}
      </Button>
      <p className="text-center text-xs text-muted-foreground">{f.consent}</p>
    </form>
  )
}
