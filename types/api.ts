export interface ApiError {
  code: string
  message: string
  details?: Record<string, string[]> | string
}

export interface ApiResponse<T> {
  data: T | null
  error: ApiError | null
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  data: T[]
  error: ApiError | null
  meta: PaginationMeta
}

export interface AnalyticsData {
  totalVendors: number
  activeQuotations: number
  pendingQuotations: number
  approvedQuotations: number
  rejectedQuotations: number
  recentActivities: ActivityLogEntry[]
  /** false when DB tables are missing or env vars are not set */
  dbReady: boolean
  /** human-readable reason when dbReady is false */
  dbMessage?: string
}

export interface ActivityLogEntry {
  id: number
  event: string
  message: string
  entity_id: number | null
  metadata: Record<string, unknown>
  created_at: string
}

export interface CompareQueryResult {
  title: string
  quotations: import('./quotation').Quotation[]
}
