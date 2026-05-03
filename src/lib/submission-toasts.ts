import { toast } from "@/hooks/use-toast"

export function toastSubmissionSuccess() {
  toast({
    title: "Your submission was successful!",
    variant: "success",
  })
}

export function toastSubmissionError(message: string) {
  toast({
    title: message,
    variant: "destructive",
  })
}

export function getSubmissionErrorMessage(payload: unknown, fallback = "Something went wrong.") {
  if (payload !== null && typeof payload === "object") {
    const o = payload as Record<string, unknown>
    if (typeof o.details === "string" && o.details.trim()) return o.details
    if (typeof o.error === "string" && o.error.trim()) return o.error
  }
  return fallback
}
