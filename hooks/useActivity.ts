import useSWR from 'swr'
import type { ActivityLogEntry, PaginatedResponse } from '@/types'

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error?.error?.message ?? `Request failed: ${res.status}`)
  }
  return res.json()
}

export interface ActivityFilters {
  type?: 'all' | 'vendor' | 'quotation' | 'status'
  q?: string
  page?: number
  limit?: number
}

export function useActivity(filters: ActivityFilters = {}) {
  const params = new URLSearchParams()
  if (filters.type && filters.type !== 'all') params.set('type', filters.type)
  if (filters.q) params.set('q', filters.q)
  if (filters.page) params.set('page', String(filters.page))
  if (filters.limit) params.set('limit', String(filters.limit))

  const key = `/api/activity?${params.toString()}`

  const { data, error, isLoading, isValidating, mutate } =
    useSWR<PaginatedResponse<ActivityLogEntry>>(key, fetcher, {
      keepPreviousData: true,
      revalidateOnFocus: false,
    })

  return {
    activities: data?.data ?? [],
    meta: data?.meta,
    error: error?.message ?? data?.error?.message ?? null,
    isLoading,
    isValidating,
    mutate,
  }
}
