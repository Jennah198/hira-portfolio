import { forwardRef } from "react"
import { HONEYPOT_FIELD } from "@/lib/honeypot"

/** Off-screen input for spam bots. Not focusable, hidden from assistive tech. */
export const Honeypot = forwardRef<HTMLInputElement>(function Honeypot(_props, ref) {
  return (
    <div aria-hidden className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0">
      <label>
        Leave this field empty
        <input ref={ref} type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  )
})
