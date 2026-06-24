import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns'

const DATE_FORMATS = {
  display: 'MMM d, yyyy',
  displayLong: 'MMMM d, yyyy',
  displayWithTime: 'MMM d, yyyy HH:mm',
  input: 'yyyy-MM-dd',
  timestamp: "yyyy-MM-dd'T'HH:mm:ssxxx",
} as const

/**
 * Format a date string or Date object for display.
 */
export function formatDate(
  date: string | Date | null | undefined,
  formatStr: keyof typeof DATE_FORMATS = 'display'
): string {
  if (!date) return '—'
  const parsed = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(parsed)) return '—'
  return format(parsed, DATE_FORMATS[formatStr])
}

/**
 * Format a date as "X time ago" (e.g. "2 hours ago").
 */
export function formatRelativeTime(date: string | Date | null | undefined): string {
  if (!date) return '—'
  const parsed = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(parsed)) return '—'
  return formatDistanceToNow(parsed, { addSuffix: true })
}

/**
 * Get today's date as a YYYY-MM-DD string (for date input defaults).
 */
export function todayAsInputValue(): string {
  return format(new Date(), DATE_FORMATS.input)
}

/**
 * Check if a date string is in the past.
 */
export function isPastDate(dateStr: string): boolean {
  const parsed = parseISO(dateStr)
  return isValid(parsed) && parsed < new Date()
}
