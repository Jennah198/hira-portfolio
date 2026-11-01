import type { Dictionary } from "@/i18n/dictionaries"

export function Steps({ t }: { t: Dictionary }) {
  return (
    <ol className="relative grid gap-6 md:grid-cols-3">
      <span aria-hidden className="absolute inset-x-[16%] top-12 hidden h-px bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-40 md:block" />
      {t.home.steps.items.map((step, i) => (
        <li
          key={step.title}
          data-reveal
          style={{ ["--reveal-delay" as string]: `${i * 120}ms` }}
          className="glass relative rounded-2xl border p-8"
        >
          <span className="accent-text block text-6xl leading-none" style={{ fontStyle: "italic" }}>
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
        </li>
      ))}
    </ol>
  )
}
