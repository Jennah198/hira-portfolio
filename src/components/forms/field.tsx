import type { ReactNode } from "react"
import { Label } from "@/components/ui/label"

/** Label + control + optional hint, with "*" for required and "(optional)" otherwise. */
export function Field({
  id,
  label,
  required,
  optionalLabel,
  hint,
  children,
}: {
  id: string
  label: string
  required?: boolean
  optionalLabel?: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="font-medium">
        {label}
        {required ? (
          <span aria-hidden className="text-gold">
            *
          </span>
        ) : optionalLabel ? (
          <span className="text-xs font-normal text-muted-foreground">({optionalLabel})</span>
        ) : null}
      </Label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  )
}
