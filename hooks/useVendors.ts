import useSWR, { type KeyedMutator } from 'swr'
import type { Vendor, PaginatedResponse, ApiResponse } from '@/types'

// ─── Fetcher ─────────────────────────────────────────────────
async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error?.error?.message ?? `Request failed: ${res.status}`)
  }
  return res.json()
}

// ─── Query params type ───────────────────────────────────────
export interface VendorFilters {
  search?: string
  status?: 'Active' | 'Inactive' | 'all'
  page?: number
  limit?: number
}

// ─── useVendors — paginated list ─────────────────────────────
export function useVendors(filters: VendorFilters = {}) {
  const params = new URLSearchParams()
  if (filters.search) params.set('search', filters.search)
  if (filters.status) params.set('status', filters.status)
  if (filters.page) params.set('page', String(filters.page))
  if (filters.limit) params.set('limit', String(filters.limit))

  const key = `/api/vendors?${params.toString()}`

  const { data, error, isLoading, isValidating, mutate } =
    useSWR<PaginatedResponse<Vendor>>(key, fetcher, {
      keepPreviousData: true,
      revalidateOnFocus: false,
    })

  return {
    vendors: data?.data ?? [],
    meta: data?.meta,
    error: error?.message ?? data?.error?.message ?? null,
    isLoading,
    isValidating,
    mutate,
  }
}

// ─── useVendor — single record ───────────────────────────────
export interface VendorWithQuotations extends Vendor {
  quotations: Array<{
    id: number
    quotation_title: string
    vendor_reference: string
    quotation_amount: number
    submission_date: string
    status: 'Pending' | 'Approved' | 'Rejected'
    created_at: string
    updated_at: string
    description: string
  }>
}

export function useVendor(id: number | null) {
  const { data, error, isLoading, mutate } =
    useSWR<ApiResponse<VendorWithQuotations>>(
      id ? `/api/vendors/${id}` : null,
      fetcher,
      { revalidateOnFocus: false }
    )

  return {
    vendor: data?.data ?? null,
    error: error?.message ?? data?.error?.message ?? null,
    isLoading,
    mutate,
  }
}

// ─── Vendor mutation helpers ──────────────────────────────────
export async function createVendor(
  payload: Omit<Vendor, 'id' | 'created_at' | 'updated_at'>
): Promise<{ data: Vendor | null; error: string | null }> {
  try {
    const res = await fetch('/api/vendors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json: ApiResponse<Vendor> = await res.json()
    if (!res.ok || json.error) {
      return { data: null, error: json.error?.message ?? 'Failed to create vendor' }
    }
    return { data: json.data, error: null }
  } catch {
    return { data: null, error: 'Network error — please try again' }
  }
}

export async function updateVendor(
  id: number,
  payload: Partial<Omit<Vendor, 'id' | 'created_at' | 'updated_at'>>
): Promise<{ data: Vendor | null; error: string | null }> {
  try {
    const res = await fetch(`/api/vendors/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json: ApiResponse<Vendor> = await res.json()
    if (!res.ok || json.error) {
      return { data: null, error: json.error?.message ?? 'Failed to update vendor' }
    }
    return { data: json.data, error: null }
  } catch {
    return { data: null, error: 'Network error — please try again' }
  }
}

export async function deleteVendor(
  id: number
): Promise<{ success: boolean; error: string | null }> {
  try {
    const res = await fetch(`/api/vendors/${id}`, { method: 'DELETE' })
    const json = await res.json()
    if (!res.ok || json.error) {
      return { success: false, error: json.error?.message ?? 'Failed to delete vendor' }
    }
    return { success: true, error: null }
  } catch {
    return { success: false, error: 'Network error — please try again' }
  }
}

export type { KeyedMutator }
