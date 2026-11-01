/**
 * Data-retention policy (must match the Privacy Policy text in the dictionaries).
 * Applied daily by /api/cron/daily.
 */
export const RETENTION = {
  /** Payment receipts and uploaded project files */
  filesMonths: 12,
  contactMonths: 12,
  /** Graduation, exhibition and guest registrations */
  registrationsMonths: 24,
  membershipMonths: 36,
  /** Uploaded files never attached to a submitted form */
  orphanHours: 24,
} as const

/** Marker stored in a NOT NULL file column after the file itself was deleted. */
export const EXPIRED_FILE = "expired"

export function monthsAgo(months: number): string {
  const d = new Date()
  d.setMonth(d.getMonth() - months)
  return d.toISOString()
}
