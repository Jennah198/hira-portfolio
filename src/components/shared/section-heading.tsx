import { cn } from "@/lib/utils"
import { Accent } from "@/components/shared/accent"

type Props = {
  index?: string
  eyebrow: string
  title: string
  intro?: string
  align?: "center" | "start"
  className?: string
  as?: "h1" | "h2"
}

/** Numbered eyebrow + headline with accent phrase + optional intro (agency-style section header). */
export function SectionHeading({ index, eyebrow, title, intro, align = "center", className, as = "h2" }: Props) {
  const Heading = as
  return (
    <div
      data-reveal
      className={cn("max-w-3xl mb-12 md:mb-16", align === "center" ? "mx-auto text-center" : "", className)}
    >
      <p className="eyebrow mb-5" data-align={align}>
        {index ? <span className="tabular-nums opacity-80">{index}</span> : null}
        {eyebrow}
      </p>
      <Heading className="text-3xl md:text-5xl font-semibold tracking-tight leading-[1.1] text-balance">
        <Accent text={title} />
      </Heading>
      {intro ? <p className="mt-5 text-lg text-muted-foreground leading-relaxed text-pretty">{intro}</p> : null}
    </div>
  )
}
