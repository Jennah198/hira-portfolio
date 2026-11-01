/** Hidden form field that humans never see; bots that fill it are silently ignored. */
export const HONEYPOT_FIELD = "website"

export function isBot(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0
}
