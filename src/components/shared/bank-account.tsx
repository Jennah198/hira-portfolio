import { Landmark } from "lucide-react"
import { CopyButton } from "@/components/shared/copy-button"
import { site } from "@/lib/site"

/** Association bank account with one-click copy. */
export function BankAccount({ title, label, note }: { title: string; label: string; note: string }) {
  return (
    <div className="glass rounded-3xl border p-7">
      <Landmark aria-hidden className="size-6 text-gold" />
      <h2 className="mt-4 font-semibold">{title}</h2>
      <p className="mt-3 text-sm text-muted-foreground">{label}</p>
      <div className="mt-1 flex flex-wrap items-center gap-3">
        <p dir="ltr" className="font-mono text-xl font-semibold tracking-wider tabular-nums">
          {site.bankAccount}
        </p>
        <CopyButton value={site.bankAccount} />
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{note}</p>
    </div>
  )
}
