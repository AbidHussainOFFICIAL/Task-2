'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DetailSkeleton, ErrorCard } from '@/components/shared'
import { VendorCard, VendorQuoteList } from '@/components/vendors'
import { useVendor } from '@/hooks/useVendors'
import { cn } from '@/lib/utils/cn'

type Tab = 'quotations' | 'activity'

export default function VendorDetailPage() {
  const { id } = useParams<{ id: string }>()
  const vendorId = Number(id)
  const [tab, setTab] = useState<Tab>('quotations')

  const { vendor, isLoading, error, mutate } = useVendor(vendorId)

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6 max-w-5xl mx-auto">
        <DetailSkeleton />
      </div>
    )
  }

  if (error || !vendor) {
    return (
      <div className="p-4 lg:p-6">
        <ErrorCard
          title="Vendor not found"
          message={error ?? 'This vendor may have been removed.'}
          onRetry={() => mutate()}
        />
      </div>
    )
  }

  const tabClass = (t: Tab) =>
    cn(
      'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors',
      tab === t
        ? 'border-primary text-primary'
        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
    )

  return (
    <div className="flex flex-col h-full">
      {/* Back nav */}
      <div className="px-4 lg:px-6 py-3 border-b border-border">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href="/vendors"><ChevronLeft className="h-4 w-4" />Back to Vendors</Link>
        </Button>
      </div>

      <div className="p-4 lg:p-6 space-y-6 w-full max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Profile card */}
          <div className="lg:col-span-1 min-w-0">
            <VendorCard vendor={vendor} onRefresh={() => mutate()} />
          </div>

          {/* Tabs */}
          <div className="lg:col-span-2 min-w-0">
            <Card className="shadow-card overflow-hidden">
              {/* Tab bar */}
              <div className="flex border-b border-border px-2 overflow-x-auto">
                <button className={tabClass('quotations')} onClick={() => setTab('quotations')}>
                  <FileText className="h-4 w-4 shrink-0" />
                  Quotations
                  {vendor.quotations && vendor.quotations.length > 0 && (
                    <span className="ml-1 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium">
                      {vendor.quotations.length}
                    </span>
                  )}
                </button>
              </div>

              <CardContent className="p-4">
                {tab === 'quotations' && (
                  <VendorQuoteList
                    quotes={vendor.quotations ?? []}
                    vendorId={vendor.id}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
