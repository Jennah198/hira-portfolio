"use client"

import type React from "react"
import { useRef, useState } from "react"
import { Building2, Presentation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field } from "@/components/forms/field"
import { Honeypot } from "@/components/forms/honeypot"
import { PrivacyNote } from "@/components/forms/privacy-note"
import { Turnstile, type TurnstileHandle } from "@/components/forms/turnstile"
import { apiErrorMessage, uploadDirect } from "@/components/forms/submit-helpers"
import { ArrowForward } from "@/components/shared/accent"
import { useI18n } from "@/i18n/client"
import { cn } from "@/lib/utils"
import { toastSubmissionError, toastSubmissionSuccess } from "@/lib/submission-toasts"

type Mode = "facilitator" | "guest-company"

const EMPTY_FACILITATOR = { fullName: "", email: "", phone: "", programOfStudy: "", projectName: "", projectExplanation: "" }
const EMPTY_COMPANY = { companyName: "", ownerFullName: "", email: "", phone: "", businessType: "", interestedArea: "" }

export function ExhibitionForm() {
  const { t } = useI18n()
  const f = t.exhibitionForm
  const mvpFileRef = useRef<HTMLInputElement>(null)
  const hpRef = useRef<HTMLInputElement>(null)
  const tsRef = useRef<TurnstileHandle>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [mvpResetKey, setMvpResetKey] = useState(0)
  const [mode, setMode] = useState<Mode>("facilitator")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [facilitator, setFacilitator] = useState(EMPTY_FACILITATOR)
  const [company, setCompany] = useState(EMPTY_COMPANY)

  const setF = (key: keyof typeof EMPTY_FACILITATOR) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFacilitator((p) => ({ ...p, [key]: e.target.value }))
  const setC = (key: keyof typeof EMPTY_COMPANY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setCompany((p) => ({ ...p, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const turnstileToken = await tsRef.current?.getToken()

      if (mode === "facilitator") {
        const demo = mvpFileRef.current?.files?.[0]
        if (!demo || demo.size === 0) {
          toastSubmissionError(f.mvpMissing)
          return
        }
        setStatus(t.common.uploading)
        const upload = await uploadDirect("mvp", demo, 30, turnstileToken, t)
        if ("error" in upload) {
          toastSubmissionError(upload.error)
          return
        }

        setStatus(t.common.submitting)
        const res = await fetch("/api/exhibition", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            full_name: facilitator.fullName,
            email: facilitator.email,
            phone_number: facilitator.phone,
            program_of_study: facilitator.programOfStudy,
            project_name: facilitator.projectName,
            project_explanation: facilitator.projectExplanation,
            mvp_path: upload.path,
            mvp_ticket: upload.ticket,
            website: hpRef.current?.value ?? "",
          }),
        })
        const payload = await res.json().catch(() => null)
        if (!res.ok) {
          toastSubmissionError(apiErrorMessage(payload, f.error, t))
          return
        }
        toastSubmissionSuccess(t.common.successToast)
        setFacilitator(EMPTY_FACILITATOR)
        setMvpResetKey((k) => k + 1)
        return
      }

      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "exhibition-guest-company",
          payload: company,
          website: hpRef.current?.value ?? "",
          turnstileToken,
        }),
      })
      const payload = await res.json().catch(() => null)
      if (!res.ok) {
        toastSubmissionError(apiErrorMessage(payload, f.error, t))
        return
      }
      toastSubmissionSuccess(t.common.successToast)
      setCompany(EMPTY_COMPANY)
    } catch {
      toastSubmissionError(t.common.errorToast)
    } finally {
      tsRef.current?.reset()
      setStatus(null)
      setIsSubmitting(false)
    }
  }

  const tabs = [
    { id: "facilitator" as const, label: f.facilitatorTab, icon: Presentation },
    { id: "guest-company" as const, label: f.guestTab, icon: Building2 },
  ]

  return (
    <div className="space-y-8">
      <div role="radiogroup" aria-label={f.chooseType} className="grid gap-3 sm:grid-cols-2">
        {tabs.map((tab) => {
          const selected = mode === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setMode(tab.id)}
              className={cn(
                "flex items-center gap-3 rounded-2xl border p-4 text-start text-sm font-medium transition-all duration-300",
                selected ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "glass-subtle hover:border-primary/40",
              )}
            >
              <tab.icon aria-hidden className="size-5 shrink-0" />
              {tab.label}
            </button>
          )
        })}
      </div>

      <form onSubmit={handleSubmit} className="relative space-y-5">
        <Honeypot ref={hpRef} />
        {mode === "facilitator" ? (
          <>
            <Field id="facilitator-name" label={f.fullName} required>
              <Input id="facilitator-name" required value={facilitator.fullName} onChange={setF("fullName")} autoComplete="name" />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="facilitator-email" label={f.email} optionalLabel={t.common.optional}>
                <Input id="facilitator-email" type="email" dir="ltr" value={facilitator.email} onChange={setF("email")} />
              </Field>
              <Field id="facilitator-phone" label={f.phone} required>
                <Input id="facilitator-phone" type="tel" dir="ltr" required value={facilitator.phone} onChange={setF("phone")} />
              </Field>
            </div>
            <Field id="facilitator-program" label={f.program} required>
              <Input id="facilitator-program" required value={facilitator.programOfStudy} onChange={setF("programOfStudy")} />
            </Field>
            <Field id="facilitator-project" label={f.projectName} required>
              <Input id="facilitator-project" required value={facilitator.projectName} onChange={setF("projectName")} />
            </Field>
            <Field id="facilitator-explanation" label={f.projectExplanation} required>
              <Textarea id="facilitator-explanation" required rows={4} value={facilitator.projectExplanation} onChange={setF("projectExplanation")} />
            </Field>
            <Field id="facilitator-mvp" label={f.mvp} required hint={f.mvpHelp}>
              <Input
                key={mvpResetKey}
                ref={mvpFileRef}
                id="facilitator-mvp"
                type="file"
                required
                accept="image/jpeg,image/png,image/webp,application/pdf,video/mp4,video/webm,application/zip"
                className="cursor-pointer"
              />
            </Field>
          </>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="company-name" label={f.companyName} required>
                <Input id="company-name" required value={company.companyName} onChange={setC("companyName")} autoComplete="organization" />
              </Field>
              <Field id="owner-name" label={f.ownerName} required>
                <Input id="owner-name" required value={company.ownerFullName} onChange={setC("ownerFullName")} autoComplete="name" />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="company-email" label={f.email} optionalLabel={t.common.optional}>
                <Input id="company-email" type="email" dir="ltr" value={company.email} onChange={setC("email")} />
              </Field>
              <Field id="company-phone" label={f.phone} required>
                <Input id="company-phone" type="tel" dir="ltr" required value={company.phone} onChange={setC("phone")} />
              </Field>
            </div>
            <Field id="business-type" label={f.businessType} required>
              <Input id="business-type" required value={company.businessType} onChange={setC("businessType")} />
            </Field>
            <Field id="interested-area" label={f.interest} required>
              <Textarea id="interested-area" required rows={4} value={company.interestedArea} onChange={setC("interestedArea")} />
            </Field>
          </>
        )}
        <Turnstile ref={tsRef} />
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (status ?? t.common.submitting) : f.submit}
          {!isSubmitting ? <ArrowForward /> : null}
        </Button>
        <PrivacyNote />
      </form>
    </div>
  )
}
