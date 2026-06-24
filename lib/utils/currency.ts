/**
 * Format a number as currency (USD by default).
 * Uses Intl.NumberFormat for locale-aware formatting.
 */
export function formatCurrency(
  amount: number,
  currency = 'USD',
  locale = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format a number as compact currency (e.g. $1.2K, $4.5M).
 */
export function formatCurrencyCompact(amount: number, currency = 'USD'): string {
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`
  }
  if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(1)}K`
  }
  return formatCurrency(amount, currency)
}

/**
 * Parse a currency string to a number (strips symbols + commas).
 */
export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[$,\s]/g, '')
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}
