'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader, SearchInput, FilterChips, ErrorCard } from '@/components/shared'
import { VendorTable } from '@/components/vendors'
import { useVendors } from '@/hooks/useVendors'
import { Card } from '@/components/ui/card'

type StatusFilter = 'all' | 'Active' | 'Inactive'

const STATUS_CHIPS = [
  { value: 'all' as StatusFilter, label: 'All' },
  { value: 'Active' as StatusFilter, label: 'Active' },
  { value: 'Inactive' as StatusFilter, label: 'Inactive' },
]

export default function VendorsPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [page, setPage] = useState(1)

  const { vendors, meta, isLoading, error, mutate } = useVendors({
    search, status, page, limit: 25,
  })

  const totalLabel = meta
    ? `${meta.total} vendor${meta.total !== 1 ? 's' : ''} registered`
    : 'Manage your supplier directory'

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Vendor Directory"
        description={totalLabel}
        action={
          <Button asChild size="sm">
            <Link href="/vendors/new">
              <Plus className="h-4 w-4" />Add Vendor
            </Link>
          </Button>
        }
      />

      <div className="p-4 lg:p-6 space-y-4 flex-1">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchInput
            value={search}
            onChange={(v) => { setSearch(v); setPage(1) }}
            placeholder="Search by name, company or email…"
            className="w-full sm:max-w-xs"
          />
          <FilterChips
            chips={STATUS_CHIPS}
            value={status}
            onChange={(v) => { setStatus(v); setPage(1) }}
          />
        </div>

        {error ? (
          <ErrorCard message={error} onRetry={() => mutate()} />
        ) : (
          <Card className="shadow-card overflow-hidden">
            <VendorTable
              vendors={vendors}
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
                    disabled={page <= 1}
                    onClick={() => setPage(p => p - 1)}>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm"
                    disabled={page >= meta.totalPages}
                    onClick={() => setPage(p => p + 1)}>
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
