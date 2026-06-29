import type { QuotationFilters } from '@/hooks'
import type { Quotation } from '@/types'

export async function fetchAllFilteredQuotations(filters: QuotationFilters): Promise<Quotation[]> {
  const params = new URLSearchParams()
  if (filters.status && filters.status !== 'all') params.set('status', filters.status)
  if (filters.vendor_id) params.set('vendor_id', String(filters.vendor_id))
  if (filters.from) params.set('from', filters.from)
  if (filters.to) params.set('to', filters.to)
  if (filters.min_amount) params.set('min_amount', String(filters.min_amount))
  if (filters.max_amount) params.set('max_amount', String(filters.max_amount))

  let page = 1
  let allQuotations: Quotation[] = []
  let hasMore = true

  while (hasMore) {
    params.set('page', String(page))
    params.set('limit', '100')
    const res = await fetch(`/api/quotations?${params.toString()}`)
    if (!res.ok) break
    const json = await res.json()
    const data: Quotation[] = json?.data ?? []
    allQuotations = [...allQuotations, ...data]
    if (data.length < 100 || page >= (json?.meta?.totalPages ?? 1)) {
      hasMore = false
    } else {
      page++
    }
  }

  return allQuotations
}

export function exportQuotationsCsv(quotations: Quotation[], filename = 'quotations.csv') {
  const headers = ['Title', 'Vendor', 'Reference', 'Amount', 'Date', 'Status']

  const escapeCsvField = (field: string | number | undefined | null) => {
    if (field === undefined || field === null) return '""'
    const stringified = String(field)
    if (/[",\n\r]/.test(stringified)) {
      return `"${stringified.replace(/"/g, '""')}"`
    }
    return `"${stringified}"`
  }

  const rows = quotations.map((q) => [
    escapeCsvField(q.quotation_title),
    escapeCsvField(q.vendors?.vendor_name ?? ''),
    escapeCsvField(q.vendor_reference),
    escapeCsvField(q.quotation_amount),
    escapeCsvField(q.submission_date),
    escapeCsvField(q.status),
  ])

  const csvContent = [headers.map((h) => `"${h}"`).join(','), ...rows.map((r) => r.join(','))].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
