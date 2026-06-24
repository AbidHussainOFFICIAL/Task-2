import useSWR from 'swr'
import type { AnalyticsData, ApiResponse } from '@/types'
import { ACTIVITY_REFRESH_INTERVAL_MS } from '@/lib/constants'

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error?.error?.message ?? `Request failed: ${res.status}`)
  }
  return res.json()
}

// ─── useAnalytics — dashboard KPIs + activity feed ───────────
// Auto-refreshes every 30 seconds to keep the feed live
export function useAnalytics() {
  const { data, error, isLoading, mutate } =
    useSWR<ApiResponse<AnalyticsData>>(
      '/api/analytics',
      fetcher,
      {
        refreshInterval: ACTIVITY_REFRESH_INTERVAL_MS,
        revalidateOnFocus: false,  // prevent flooding on tab-switch / DevTools focus
        errorRetryCount: 2,        // stop retrying after 2 failures — avoids hammering a broken endpoint
      }
    )

  return {
    analytics: data?.data ?? null,
    error: error?.message ?? data?.error?.message ?? null,
    isLoading,
    mutate,
    // true = live data; false = DB not connected / tables missing; undefined = still loading
    dbReady: data?.data?.dbReady,
    dbMessage: data?.data?.dbMessage,
    // Convenience destructures
    totalVendors: data?.data?.totalVendors ?? 0,
    activeQuotations: data?.data?.activeQuotations ?? 0,
    pendingQuotations: data?.data?.pendingQuotations ?? 0,
    approvedQuotations: data?.data?.approvedQuotations ?? 0,
    rejectedQuotations: data?.data?.rejectedQuotations ?? 0,
    recentActivities: data?.data?.recentActivities ?? [],
  }
}
