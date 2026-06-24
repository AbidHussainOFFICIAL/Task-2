'use client'

import { Building2, Calendar, Hash, TrendingDown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { QuotationStatusBadge, PriceDisplay, DateDisplay } from '@/components/shared'
import { cn } from '@/lib/utils/cn'
import type { Quotation } from '@/types'

interface CompareCardProps {
  quotation: Quotation
  isBestPrice: boolean
  rank: number
}

export function CompareCard({ quotation, isBestPrice, rank }: CompareCardProps) {
  const vendor = quotation.vendors

  return (
    <div className="relative">
      {/* Best price ring */}
      {isBestPrice && (
        <div className="absolute -inset-[2px] rounded-[14px] bg-status-approved animate-pulse-ring z-0" />
      )}

      <Card className={cn(
        'relative z-10 shadow-card transition-all',
        isBestPrice && 'border-status-approved border-2'
      )}>
        {/* Best price banner */}
        {isBestPrice && (
          <div className="flex items-center gap-1.5 px-4 py-2 bg-status-approved-bg border-b border-status-approved/20">
            <TrendingDown className="h-3.5 w-3.5 text-status-approved" />
            <span className="text-xs font-semibold text-status-approved-foreground">
              Most Cost-Effective
            </span>
          </div>
        )}

        <CardContent className="p-5 space-y-4">
          {/* Rank + status */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
              #{rank}
            </span>
            <QuotationStatusBadge status={quotation.status} />
          </div>

          {/* Vendor */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">
              {vendor?.vendor_name?.slice(0, 2).toUpperCase() ?? '??'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {vendor?.vendor_name ?? 'Unknown Vendor'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {vendor?.company_name ?? ''}
              </p>
            </div>
          </div>

          {/* Amount — hero */}
          <div className={cn(
            'rounded-lg p-3 text-center',
            isBestPrice ? 'bg-status-approved-bg' : 'bg-muted'
          )}>
            <PriceDisplay
              amount={quotation.quotation_amount}
              size="lg"
              className={cn(isBestPrice && 'text-status-approved-foreground')}
            />
          </div>

          {/* Meta fields */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Hash className="h-3.5 w-3.5 shrink-0" />
              <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-[11px]">
                {quotation.vendor_reference}
              </code>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <DateDisplay date={quotation.submission_date} className="text-xs" />
            </div>
            {vendor?.email_address && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{vendor.email_address}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
