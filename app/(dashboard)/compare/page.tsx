'use client'

import { useState } from 'react'
import { BarChart3, ArrowUpDown, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { EmptyState, ErrorCard } from '@/components/shared'
import { Skeleton } from '@/components/ui/skeleton'
import { CompareCard } from '@/components/compare/CompareCard'
import { useComparison, useComparisonTitles } from '@/hooks/useComparison'
import { exportComparisonPdf } from '@/lib/pdf/comparison-export'
import { toast } from 'sonner'
import type { Quotation } from '@/types'

type SortMode = 'price_asc' | 'price_desc' | 'vendor_az'

function sortQuotations(quotations: Quotation[], mode: SortMode): Quotation[] {
  return [...quotations].sort((a, b) => {
    if (mode === 'price_asc')  return Number(a.quotation_amount) - Number(b.quotation_amount)
    if (mode === 'price_desc') return Number(b.quotation_amount) - Number(a.quotation_amount)
    if (mode === 'vendor_az') {
      const na = a.vendors?.vendor_name ?? ''
      const nb = b.vendors?.vendor_name ?? ''
      return na.localeCompare(nb)
    }
    return 0
  })
}

export default function ComparePage() {
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null)
  const [sortMode, setSortMode] = useState<SortMode>('price_asc')
  const [exporting, setExporting] = useState(false)

  const { titles, isLoading: titlesLoading, error: titlesError } = useComparisonTitles()
  const {
    quotations, lowestAmount, count, isLoading, error,
    isBestPrice,
  } = useComparison(selectedTitle)

  const sorted = sortQuotations(quotations, sortMode)

  async function handleExport() {
    if (!selectedTitle || quotations.length === 0) return
    setExporting(true)
    try {
      await exportComparisonPdf(selectedTitle, sorted, lowestAmount)
      toast.success('Comparison report downloaded')
    } catch (e) {
      toast.error('Failed to export PDF')
      console.error(e)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 lg:p-6 space-y-6">
        {/* Controls row */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              {/* Title selector */}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-1.5 font-medium">Select Quotation Title</p>
                {titlesLoading ? (
                  <Skeleton className="h-9 w-full max-w-sm" />
                ) : titlesError ? (
                  <p className="text-sm text-destructive">{titlesError}</p>
                ) : (
                  <Select value={selectedTitle ?? ''} onValueChange={setSelectedTitle}>
                    <SelectTrigger className="max-w-sm">
                      <SelectValue placeholder="Choose a quotation title to compare…" />
                    </SelectTrigger>
                    <SelectContent>
                      {titles.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Sort + Export */}
              {selectedTitle && quotations.length > 0 && (
                <div className="flex items-center gap-2 shrink-0">
                  <Select value={sortMode} onValueChange={(v) => setSortMode(v as SortMode)}>
                    <SelectTrigger className="w-[160px]">
                      <ArrowUpDown className="h-3.5 w-3.5 mr-1.5" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price_asc">Price: Low → High</SelectItem>
                      <SelectItem value="price_desc">Price: High → Low</SelectItem>
                      <SelectItem value="vendor_az">Vendor: A → Z</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExport}
                    disabled={exporting}
                    className="gap-1.5"
                  >
                    <Download className="h-3.5 w-3.5" />
                    {exporting ? 'Exporting…' : 'Export PDF'}
                  </Button>
                </div>
              )}
            </div>

            {/* Summary strip */}
            {selectedTitle && !isLoading && count > 0 && (
              <div className="mt-3 pt-3 border-t border-border flex items-center gap-4 text-xs text-muted-foreground">
                <span><strong className="text-foreground">{count}</strong> submission{count !== 1 ? 's' : ''} for this title</span>
                {lowestAmount !== null && (
                  <span>
                    Lowest bid: <strong className="text-status-approved-foreground">${lowestAmount.toLocaleString()}</strong>
                  </span>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results grid */}
        {!selectedTitle ? (
          <EmptyState
            icon={BarChart3}
            title="Select a quotation title"
            description="Choose a quotation title above to compare all vendor submissions side by side and identify the most cost-effective option."
          />
        ) : isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[280px] rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <ErrorCard message={error} />
        ) : sorted.length === 0 ? (
          <EmptyState
            icon={BarChart3}
            title="No submissions found"
            description="No vendors have submitted quotes for this title yet."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sorted.map((q, i) => (
              <CompareCard
                key={q.id}
                quotation={q}
                isBestPrice={isBestPrice(Number(q.quotation_amount))}
                rank={i + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
