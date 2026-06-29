'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { QuotationFiltersBar } from '@/components/quotations/QuotationFilters'
import { QuotationTable } from '@/components/quotations/QuotationTable'
import { useQuotations } from '@/hooks/useQuotations'
import type { QuotationFilters } from '@/hooks/useQuotations'
import { exportQuotationsCsv, fetchAllFilteredQuotations } from '@/lib/utils/export'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Download, FileText, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { PageHeader, ErrorCard } from '@/components/shared'

const DEFAULT_FILTERS: QuotationFilters = { status: 'all', page: 1, limit: 25 }

export function QuotationsContent() {
  const [filters, setFilters] = useState<QuotationFilters>(DEFAULT_FILTERS)
  const [isExportingCsv, setIsExportingCsv] = useState(false)
  const [isExportingPdf, setIsExportingPdf] = useState(false)

  function updateFilters(partial: Partial<QuotationFilters>) {
    setFilters((prev) => ({ ...prev, ...partial, page: partial.page ?? 1 }))
  }

  const { quotations, meta, isLoading, error, mutate } = useQuotations(filters)

  async function handleExportCsv() {
    setIsExportingCsv(true)
    try {
      const data = await fetchAllFilteredQuotations(filters)
      if (data.length === 0) {
        toast.error('No quotations match the active filters to export.')
        return
      }
      exportQuotationsCsv(data, `Quotations-Export-${new Date().toISOString().slice(0, 10)}.csv`)
      toast.success(`Exported ${data.length} quotation(s) to CSV`)
    } catch {
      toast.error('Failed to export CSV. Please try again.')
    } finally {
      setIsExportingCsv(false)
    }
  }

  async function handleExportPdf() {
    setIsExportingPdf(true)
    try {
      const data = await fetchAllFilteredQuotations(filters)
      if (data.length === 0) {
        toast.error('No quotations match the active filters to export.')
        return
      }
      const { exportQuotationsListPdf } = await import('@/lib/pdf/quotation-export')
      await exportQuotationsListPdf(data, `Filtered Quotations (${data.length} records)`)
      toast.success(`Exported ${data.length} quotation(s) to PDF`)
    } catch {
      toast.error('Failed to generate PDF export.')
    } finally {
      setIsExportingPdf(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Quotations"
        description={meta ? `${meta.total} quotation${meta.total !== 1 ? 's' : ''} total` : 'Track and manage quotation requests'}
        action={
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={handleExportCsv} disabled={isExportingCsv} className="gap-1.5">
              {isExportingCsv ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              <span className="hidden xs:inline">Export CSV</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportPdf} disabled={isExportingPdf} className="gap-1.5">
              {isExportingPdf ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
              <span className="hidden xs:inline">Export PDF</span>
            </Button>
            <Button asChild size="sm" className="gap-1.5">
              <Link href="/quotations/new"><Plus className="h-4 w-4" /><span className="hidden xs:inline">New </span>Quotation</Link>
            </Button>
          </div>
        }
      />

      <div className="p-4 lg:p-6 space-y-4 flex-1">
        <QuotationFiltersBar
          filters={filters}
          onChange={updateFilters}
          onReset={() => setFilters(DEFAULT_FILTERS)}
        />

        {error ? (
          <ErrorCard message={error} onRetry={() => mutate()} />
        ) : (
          <Card className="shadow-card overflow-hidden">
            <QuotationTable
              quotations={quotations}
              isLoading={isLoading}
              onRefresh={() => mutate()}
            />

            {meta && meta.totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Page {meta.page} of {meta.totalPages} · {meta.total} total
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm"
                    disabled={(filters.page ?? 1) <= 1}
                    onClick={() => updateFilters({ page: (filters.page ?? 1) - 1 })}>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm"
                    disabled={(filters.page ?? 1) >= meta.totalPages}
                    onClick={() => updateFilters({ page: (filters.page ?? 1) + 1 })}>
                    Next
                  </Button>
                </div>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  )
}
