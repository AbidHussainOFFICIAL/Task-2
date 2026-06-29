'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { useActivity } from '@/hooks/useActivity'
import type { ActivityFilters } from '@/hooks/useActivity'
import { cn } from '@/lib/utils/cn'

import { useState } from 'react'
import { Activity, Building2, FileText, CheckCircle2, RotateCcw } from 'lucide-react'

import { PageHeader, ErrorCard, SearchInput } from '@/components/shared'

const DEFAULT_FILTERS: ActivityFilters = { type: 'all', q: '', page: 1, limit: 25 }

const TYPE_OPTIONS: { id: ActivityFilters['type']; label: string; icon: React.ElementType }[] = [
  { id: 'all', label: 'All Events', icon: Activity },
  { id: 'vendor', label: 'Vendor Events', icon: Building2 },
  { id: 'quotation', label: 'Quotation Events', icon: FileText },
  { id: 'status', label: 'Status Changes', icon: CheckCircle2 },
]

export function ActivityContent() {
  const [filters, setFilters] = useState<ActivityFilters>(DEFAULT_FILTERS)

  function updateFilters(partial: Partial<ActivityFilters>) {
    setFilters((prev) => ({ ...prev, ...partial, page: partial.page ?? 1 }))
  }

  const { activities, meta, isLoading, error, mutate } = useActivity(filters)

  const hasActiveFilters = (filters.type && filters.type !== 'all') || Boolean(filters.q)

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Activity Log"
        description={
          meta
            ? `${meta.total} activity record${meta.total !== 1 ? 's' : ''} logged`
            : 'Comprehensive audit trail of system events'
        }
      />

      <div className="p-4 lg:p-6 space-y-4 flex-1">
        {/* Filters & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 rounded-lg border border-border shadow-sm">
          {/* Event type tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {TYPE_OPTIONS.map((opt) => {
              const Icon = opt.icon
              const active = (filters.type ?? 'all') === opt.id
              return (
                <button
                  key={opt.id}
                  onClick={() => updateFilters({ type: opt.id })}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors',
                    active
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {opt.label}
                </button>
              )
            })}
          </div>

          {/* Search and Reset */}
          <div className="flex items-center gap-2">
            <SearchInput
              value={filters.q ?? ''}
              onChange={(q) => updateFilters({ q })}
              placeholder="Search activity message…"
              className="w-full sm:w-64"
            />
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
                title="Reset filters"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Content Card */}
        {error ? (
          <ErrorCard message={error} onRetry={() => mutate()} />
        ) : (
          <Card className="shadow-card overflow-hidden">
            <CardContent className="p-4 lg:p-6">
              <ActivityFeed activities={activities} isLoading={isLoading} />
            </CardContent>

            {/* Pagination footer */}
            {meta && meta.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
                <p className="text-xs text-muted-foreground">
                  Page {meta.page} of {meta.totalPages} · {meta.total} total
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={(filters.page ?? 1) <= 1}
                    onClick={() => updateFilters({ page: (filters.page ?? 1) - 1 })}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={(filters.page ?? 1) >= meta.totalPages}
                    onClick={() => updateFilters({ page: (filters.page ?? 1) + 1 })}
                  >
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
