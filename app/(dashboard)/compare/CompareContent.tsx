'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useComparison, useComparisonTitles } from '@/hooks/useComparison'
import { cn } from '@/lib/utils/cn'

import { useState } from 'react'
import { BarChart3, ArrowUpDown, Download, ChevronsUpDown, Check, X } from 'lucide-react'

import { EmptyState, ErrorCard } from '@/components/shared'

import { CompareCard } from '@/components/compare/CompareCard'

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

/* ── Searchable combobox for quotation titles ─────────────────── */
interface TitleComboboxProps {
  titles: string[]
  value: string | null
  onChange: (v: string | null) => void
}

function TitleCombobox({ titles, value, onChange }: TitleComboboxProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = search.trim()
    ? titles.filter((t) => t.toLowerCase().includes(search.toLowerCase()))
    : titles

  function select(title: string) {
    onChange(title === value ? null : title)
    setOpen(false)
    setSearch('')
  }

  function clear(e: React.MouseEvent) {
    e.stopPropagation()
    onChange(null)
    setSearch('')
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-controls="quotation-select-list"
          aria-label="Select quotation title"
          className={cn(
            'flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background',
            'hover:bg-accent/30 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors',
            !value && 'text-muted-foreground'
          )}
        >
          <span className="truncate">{value ?? 'Search quotation titles…'}</span>
          <span className="flex items-center gap-1 shrink-0 ml-2">
            {value && (
              <X
                className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors"
                onClick={clear}
                aria-label="Clear selection"
              />
            )}
            <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] max-w-sm p-0"
        align="start"
        sideOffset={4}
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Type to search titles…"
            value={search}
            onValueChange={setSearch}
          />
          <CommandList id="quotation-select-list">
            {filtered.length === 0 ? (
              <CommandEmpty>No titles match &quot;{search}&quot;</CommandEmpty>
            ) : (
              <CommandGroup heading={`${filtered.length} title${filtered.length !== 1 ? 's' : ''}`}>
                {filtered.map((title) => (
                  <CommandItem
                    key={title}
                    value={title}
                    onSelect={() => select(title)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Check
                      className={cn(
                        'h-3.5 w-3.5 shrink-0 transition-opacity',
                        value === title ? 'opacity-100 text-primary' : 'opacity-0'
                      )}
                    />
                    <span className="truncate">{title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export function CompareContent() {
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
              {/* Title selector — searchable combobox */}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-1.5 font-medium">Select Quotation Title</p>
                {titlesLoading ? (
                  <Skeleton className="h-9 w-full max-w-sm" />
                ) : titlesError ? (
                  <p className="text-sm text-destructive">{titlesError}</p>
                ) : (
                  <TitleCombobox
                    titles={titles}
                    value={selectedTitle}
                    onChange={setSelectedTitle}
                  />
                )}
              </div>

              {/* Sort + Export */}
              {selectedTitle && quotations.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <Select value={sortMode} onValueChange={(v) => setSortMode(v as SortMode)}>
                    <SelectTrigger className="w-[140px] sm:w-[160px]">
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
              <div className="mt-3 pt-3 border-t border-border flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
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
