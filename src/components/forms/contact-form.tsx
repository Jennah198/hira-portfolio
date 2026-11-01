"use client"

import type React from "react"
import { useRef, useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field } from "@/components/forms/field"
import { Honeypot } from "@/components/forms/honeypot"
import { useI18n } from "@/i18n/client"
import { getSubmissionErrorMessage, toastSubmissionError, toastSubmissionSuccess } from "@/lib/submission-toasts"

const EMPTY = { name: "", email: "", subject: "", message: "" }

export function ContactForm() {
  const { t } = useI18n()
  const f = t.contact.form
  const hpRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState(EMPTY)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, website: hpRef.current?.value ?? "" }),
      })
      const payload = await res.json().catch(() => null)
      if (!res.ok) {
        toastSubmissionError(getSubmissionErrorMessage(payload, f.error))
        return
      }
      setFormData(EMPTY)
      toastSubmissionSuccess(t.common.successToast)
    } catch {
      toastSubmissionError(t.common.errorToast)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative space-y-5">
      <Honeypot ref={hpRef} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label={f.name} required>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required placeholder={f.namePh} autoComplete="name" />
        </Field>
        <Field id="email" label={f.email} required>
          <Input id="email" name="email" type="email" dir="ltr" value={formData.email} onChange={handleChange} required placeholder={f.emailPh} autoComplete="email" />
        </Field>
      </div>
      <Field id="subject" label={f.subject} required>
        <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} required placeholder={f.subjectPh} />
      </Field>
      <Field id="message" label={f.message} required>
        <Textarea id="message" name="message" value={formData.message} onChange={handleChange} required placeholder={f.messagePh} rows={6} />
      </Field>
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          t.common.sending
        ) : (
          <>
            <Send aria-hidden className="size-4 rtl:-scale-x-100" />
            {f.submit}
          </>
        )}
      </Button>
    </form>
  )
}
