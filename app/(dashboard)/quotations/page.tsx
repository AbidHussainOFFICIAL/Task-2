'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PageHeader, ErrorCard } from '@/components/shared'
import { QuotationTable } from '@/components/quotations/QuotationTable'
import { QuotationFiltersBar } from '@/components/quotations/QuotationFilters'
import { useQuotations, type QuotationFilters } from '@/hooks/useQuotations'

const DEFAULT_FILTERS: QuotationFilters = { status: 'all', page: 1, limit: 25 }

export default function QuotationsPage() {
  const [filters, setFilters] = useState<QuotationFilters>(DEFAULT_FILTERS)

  function updateFilters(partial: Partial<QuotationFilters>) {
    setFilters((prev) => ({ ...prev, ...partial, page: partial.page ?? 1 }))
  }

  const { quotations, meta, isLoading, error, mutate } = useQuotations(filters)

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Quotations"
        description={meta ? `${meta.total} quotation${meta.total !== 1 ? 's' : ''} total` : 'Track and manage quotation requests'}
        action={
          <Button asChild size="sm">
            <Link href="/quotations/new"><Plus className="h-4 w-4" />New Quotation</Link>
          </Button>
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
              <div className="flex items-center justify-between px-4 py-3 border-t border-border">
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
