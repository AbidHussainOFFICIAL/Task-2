/**
 * Generate a structured vendor reference code.
 * Format: REF-QUOTE-YYYY-NNNN (e.g. REF-QUOTE-2024-0042)
 *
 * In production, NNNN comes from the database sequence.
 * This generates a client-side preview; the API validates uniqueness.
 */
export function generateReference(sequence?: number): string {
  const year = new Date().getFullYear()
  const seq = sequence ?? Math.floor(Math.random() * 9000) + 1000
  const paddedSeq = String(seq).padStart(4, '0')
  return `REF-QUOTE-${year}-${paddedSeq}`
}

/**
 * Validate a reference code format.
 */
export function isValidReference(ref: string): boolean {
  return /^REF-QUOTE-\d{4}-\d{4}$/.test(ref)
}

/**
 * Extract the year from a reference code.
 */
export function getReferenceYear(ref: string): number | null {
  const match = ref.match(/^REF-QUOTE-(\d{4})-\d{4}$/)
  return match ? parseInt(match[1], 10) : null
}
