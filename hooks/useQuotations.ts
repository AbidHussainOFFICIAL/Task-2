import useSWR from 'swr'
import type { Quotation, PaginatedResponse, ApiResponse } from '@/types'

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error?.error?.message ?? `Request failed: ${res.status}`)
  }
  return res.json()
}

export interface QuotationFilters {
  status?: 'Pending' | 'Approved' | 'Rejected' | 'all'
  vendor_id?: number
  from?: string
  to?: string
  min_amount?: number
  max_amount?: number
  page?: number
  limit?: number
}

// ─── useQuotations — paginated + filtered list ───────────────
export function useQuotations(filters: QuotationFilters = {}) {
  const params = new URLSearchParams()
  if (filters.status) params.set('status', filters.status)
  if (filters.vendor_id) params.set('vendor_id', String(filters.vendor_id))
  if (filters.from) params.set('from', filters.from)
  if (filters.to) params.set('to', filters.to)
  if (filters.min_amount) params.set('min_amount', String(filters.min_amount))
  if (filters.max_amount) params.set('max_amount', String(filters.max_amount))
  if (filters.page) params.set('page', String(filters.page))
  if (filters.limit) params.set('limit', String(filters.limit))

  const key = `/api/quotations?${params.toString()}`

  const { data, error, isLoading, isValidating, mutate } =
    useSWR<PaginatedResponse<Quotation>>(key, fetcher, {
      keepPreviousData: true,
      revalidateOnFocus: false,
    })

  return {
    quotations: data?.data ?? [],
    meta: data?.meta,
    error: error?.message ?? data?.error?.message ?? null,
    isLoading,
    isValidating,
    mutate,
  }
}

// ─── useQuotation — single record ────────────────────────────
export function useQuotation(id: number | null) {
  const { data, error, isLoading, mutate } =
    useSWR<ApiResponse<Quotation>>(
      id ? `/api/quotations/${id}` : null,
      fetcher,
      { revalidateOnFocus: false }
    )

  return {
    quotation: data?.data ?? null,
    error: error?.message ?? data?.error?.message ?? null,
    isLoading,
    mutate,
    isNotFound: data?.error?.code === 'NOT_FOUND',
  }
}

// ─── Mutation helpers ────────────────────────────────────────
export async function createQuotation(
  payload: Omit<Quotation, 'id' | 'created_at' | 'updated_at' | 'vendors'>
): Promise<{ data: Quotation | null; error: string | null }> {
  try {
    const res = await fetch('/api/quotations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json: ApiResponse<Quotation> = await res.json()
    if (!res.ok || json.error) {
      return { data: null, error: json.error?.message ?? 'Failed to create quotation' }
    }
    return { data: json.data, error: null }
  } catch {
    return { data: null, error: 'Network error — please try again' }
  }
}

export async function updateQuotation(
  id: number,
  payload: Partial<Omit<Quotation, 'id' | 'vendor_reference' | 'created_at' | 'updated_at' | 'vendors'>>
): Promise<{ data: Quotation | null; error: string | null }> {
  try {
    const res = await fetch(`/api/quotations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json: ApiResponse<Quotation> = await res.json()
    if (!res.ok || json.error) {
      return { data: null, error: json.error?.message ?? 'Failed to update quotation' }
    }
    return { data: json.data, error: null }
  } catch {
    return { data: null, error: 'Network error — please try again' }
  }
}

export async function updateQuotationStatus(
  id: number,
  status: 'Approved' | 'Rejected'
): Promise<{ data: Quotation | null; error: string | null }> {
  try {
    const res = await fetch(`/api/quotations/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    const json: ApiResponse<Quotation> = await res.json()
    if (!res.ok || json.error) {
      return { data: null, error: json.error?.message ?? 'Failed to update status' }
    }
    return { data: json.data, error: null }
  } catch {
    return { data: null, error: 'Network error — please try again' }
  }
}

export async function deleteQuotation(
  id: number
): Promise<{ success: boolean; error: string | null }> {
  try {
    const res = await fetch(`/api/quotations/${id}`, { method: 'DELETE' })
    const json = await res.json()
    if (!res.ok || json.error) {
      return { success: false, error: json.error?.message ?? 'Failed to delete quotation' }
    }
    return { success: true, error: null }
  } catch {
    return { success: false, error: 'Network error — please try again' }
  }
}
