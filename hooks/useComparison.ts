import useSWR from 'swr'
import type { Quotation, ApiResponse } from '@/types'

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error?.error?.message ?? `Request failed: ${res.status}`)
  }
  return res.json()
}

interface ComparisonData {
  title: string
  quotations: Quotation[]
  lowestAmount: number | null
  count: number
}

interface TitlesData {
  titles: string[]
}

// ─── useComparisonTitles — all unique quotation titles ───────
export function useComparisonTitles() {
  const { data, error, isLoading } =
    useSWR<ApiResponse<TitlesData>>('/api/compare', fetcher, {
      revalidateOnFocus: false,
    })

  return {
    titles: data?.data?.titles ?? [],
    error: error?.message ?? data?.error?.message ?? null,
    isLoading,
  }
}

// ─── useComparison — all quotes for a specific title ─────────
export function useComparison(title: string | null) {
  const key = title ? `/api/compare?title=${encodeURIComponent(title)}` : null

  const { data, error, isLoading, mutate } =
    useSWR<ApiResponse<ComparisonData>>(key, fetcher, {
      revalidateOnFocus: false,
    })

  const quotations = data?.data?.quotations ?? []
  const lowestAmount = data?.data?.lowestAmount ?? null

  return {
    quotations,
    lowestAmount,
    count: data?.data?.count ?? 0,
    error: error?.message ?? data?.error?.message ?? null,
    isLoading,
    mutate,
    // Helper: check if a given quotation is the cheapest
    isBestPrice: (amount: number) =>
      lowestAmount !== null && Number(amount) === lowestAmount,
  }
}
