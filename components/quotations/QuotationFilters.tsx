'use client'

import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet'
import { FilterChips } from '@/components/shared'
import type { QuotationFilters } from '@/hooks/useQuotations'

type StatusFilter = 'all' | 'Pending' | 'Approved' | 'Rejected'

const STATUS_CHIPS = [
  { value: 'all' as StatusFilter,      label: 'All' },
  { value: 'Pending' as StatusFilter,  label: 'Pending' },
  { value: 'Approved' as StatusFilter, label: 'Approved' },
  { value: 'Rejected' as StatusFilter, label: 'Rejected' },
]

interface QuotationFiltersBarProps {
  filters: QuotationFilters
  onChange: (f: Partial<QuotationFilters>) => void
  onReset: () => void
}

export function QuotationFiltersBar({ filters, onChange, onReset }: QuotationFiltersBarProps) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [localMin, setLocalMin] = useState(filters.min_amount?.toString() ?? '')
  const [localMax, setLocalMax] = useState(filters.max_amount?.toString() ?? '')
  const [localFrom, setLocalFrom] = useState(filters.from ?? '')
  const [localTo, setLocalTo] = useState(filters.to ?? '')

  const hasAdvancedFilters =
    filters.min_amount || filters.max_amount || filters.from || filters.to

  function applyAdvanced() {
    onChange({
      min_amount: localMin ? Number(localMin) : undefined,
      max_amount: localMax ? Number(localMax) : undefined,
      from: localFrom || undefined,
      to: localTo || undefined,
    })
    setSheetOpen(false)
  }

  function resetAll() {
    setLocalMin(''); setLocalMax(''); setLocalFrom(''); setLocalTo('')
    onReset()
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:flex-wrap">
        <FilterChips
          chips={STATUS_CHIPS}
          value={(filters.status ?? 'all') as StatusFilter}
          onChange={(v) => onChange({ status: v === 'all' ? 'all' : v, page: 1 })}
        />

        <div className="flex items-center gap-2 sm:ml-auto flex-wrap">
          {hasAdvancedFilters && (
            <Button variant="ghost" size="sm" onClick={resetAll} className="text-muted-foreground gap-1.5">
              <X className="h-3.5 w-3.5" />Clear filters
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSheetOpen(true)}
            className="gap-1.5"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
            {hasAdvancedFilters && (
              <span className="ml-1 rounded-full bg-primary w-1.5 h-1.5 inline-block" />
            )}
          </Button>
        </div>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full xs:w-[320px] max-w-full">
          <SheetHeader>
            <SheetTitle>Advanced Filters</SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Date range */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Submission Date Range</p>
              <div className="space-y-2">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">From</Label>
                  <Input type="date" value={localFrom} onChange={(e) => setLocalFrom(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">To</Label>
                  <Input type="date" value={localTo} onChange={(e) => setLocalTo(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Price range */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Amount Range (USD)</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Min</Label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
                    <Input
                      type="number" min="0" step="0.01"
                      placeholder="0"
                      value={localMin}
                      onChange={(e) => setLocalMin(e.target.value)}
                      className="pl-6"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Max</Label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
                    <Input
                      type="number" min="0" step="0.01"
                      placeholder="Any"
                      value={localMax}
                      onChange={(e) => setLocalMax(e.target.value)}
                      className="pl-6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <SheetFooter className="mt-8 flex gap-2">
            <Button variant="outline" onClick={resetAll} className="flex-1">Reset</Button>
            <Button onClick={applyAdvanced} className="flex-1">Apply</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}
