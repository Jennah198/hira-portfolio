import { Fragment } from "react"
import { ArrowLeft, ArrowRight, type LucideProps } from "lucide-react"
import { cn } from "@/lib/utils"

/** Renders "Text with *accent phrase*" — the starred part becomes an italic/gold accent. */
export function Accent({ text, tone }: { text: string; tone?: "hero" }) {
  const parts = text.split(/\*(.+?)\*/g)
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="accent-text" data-tone={tone}>
            {part}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  )
}

/** Forward arrow that points the reading direction (flips in RTL) and nudges on button hover. */
export function ArrowForward({ className, ...props }: LucideProps) {
  return (
    <ArrowRight
      aria-hidden
      className={cn(
        "size-4 transition-transform duration-300 rtl:-scale-x-100 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1",
        className,
      )}
      {...props}
    />
  )
}

/** Back arrow (flips in RTL). */
export function ArrowBack({ className, ...props }: LucideProps) {
  return (
    <ArrowLeft
      aria-hidden
      className={cn(
        "size-4 transition-transform duration-300 rtl:-scale-x-100 group-hover/btn:-translate-x-1 rtl:group-hover/btn:translate-x-1",
        className,
      )}
      {...props}
    />
  )
}
