// ============================================================
// FS-2 Global Constants
// ============================================================

/** Quotation workflow statuses */
export const QUOTATION_STATUSES = ['Pending', 'Approved', 'Rejected'] as const
export type QuotationStatusConst = (typeof QUOTATION_STATUSES)[number]

/** Vendor lifecycle statuses */
export const VENDOR_STATUSES = ['Active', 'Inactive'] as const
export type VendorStatusConst = (typeof VENDOR_STATUSES)[number]

/** Default rows per page for all tables */
export const DEFAULT_PAGE_SIZE = 25

/** Maximum rows per page */
export const MAX_PAGE_SIZE = 100

/** Debounce delay for search inputs (ms) */
export const SEARCH_DEBOUNCE_MS = 300

/** Activity feed refresh interval (ms) */
export const ACTIVITY_REFRESH_INTERVAL_MS = 30_000

/** Maximum quotation amount */
export const MAX_QUOTATION_AMOUNT = 999_999_999.99

/** Reference code regex */
export const REFERENCE_CODE_REGEX = /^REF-QUOTE-\d{4}-\d{4}$/

/** Status transition rules — terminal states cannot be changed */
export const STATUS_TRANSITIONS: Record<string, string[]> = {
  Pending: ['Approved', 'Rejected'],
  Approved: [],
  Rejected: [],
}

/** Human-readable event labels for activity log */
export const ACTIVITY_EVENT_LABELS: Record<string, string> = {
  vendor_created: 'Vendor onboarded',
  vendor_updated: 'Vendor updated',
  vendor_deleted: 'Vendor removed',
  quote_created: 'Quotation created',
  quote_submitted: 'Quote submitted',
  quote_approved: 'Quote approved',
  quote_rejected: 'Quote rejected',
}

/** Navigation items for the sidebar */
export const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/vendors', label: 'Vendors', icon: 'Building2' },
  { href: '/quotations', label: 'Quotations', icon: 'FileText' },
  { href: '/compare', label: 'Compare', icon: 'BarChart3' },
] as const

/** App metadata */
export const APP_NAME = 'FS-2'
export const APP_FULL_NAME = 'Vendor Management System'
export const APP_VERSION = '1.0.0'
