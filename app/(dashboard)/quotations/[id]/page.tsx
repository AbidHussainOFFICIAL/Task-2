'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { ChevronLeft, Building2, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  DetailSkeleton, ErrorCard, PriceDisplay, DateDisplay,
  QuotationStatusBadge,
} from '@/components/shared'
import { StatusController } from '@/components/quotations/StatusController'
import { QuotationTimeline } from '@/components/quotations/QuotationTimeline'
import { useQuotation } from '@/hooks/useQuotations'
import { toast } from 'sonner'

export default function QuotationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { quotation, isLoading, error, mutate } = useQuotation(Number(id))
  const [exporting, setExporting] = useState(false)

  async function handleExport() {
    if (!quotation) return
    setExporting(true)
    try {
      const { exportQuotationPdf } = await import('@/lib/pdf/quotation-export')
      await exportQuotationPdf(quotation)
      toast.success('Quotation exported as PDF')
    } catch {
      toast.error('Failed to export PDF')
    } finally {
      setExporting(false)
    }
  }

  if (isLoading) return <div className="p-4 lg:p-6"><DetailSkeleton /></div>

  if (error || !quotation) {
    return (
      <div className="p-4 lg:p-6">
        <ErrorCard
          title="Quotation not found"
          message={error ?? 'This quotation may have been removed.'}
          onRetry={() => mutate()}
        />
      </div>
    )
  }

  const vendor = quotation.vendors

  return (
    <div className="flex flex-col h-full">
      {/* Back nav + export */}
      <div className="px-4 lg:px-6 py-3 border-b border-border flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href="/quotations"><ChevronLeft className="h-4 w-4" />Back to Quotations</Link>
        </Button>
        <Button variant="outline" size="sm" onClick={handleExport} disabled={exporting} className="gap-1.5">
          <Download className="h-3.5 w-3.5" />
          {exporting ? 'Exporting…' : 'Export PDF'}
        </Button>
      </div>

      <div className="p-4 lg:p-6 space-y-6 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left — main detail */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-mono text-muted-foreground mb-1">
                      {quotation.vendor_reference}
                    </p>
                    <h2 className="text-xl font-bold text-foreground leading-tight">
                      {quotation.quotation_title}
                    </h2>
                  </div>
                  <QuotationStatusBadge status={quotation.status} className="shrink-0" />
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Amount</p>
                    <PriceDisplay amount={quotation.quotation_amount} size="lg" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Submission Date</p>
                    <p className="text-sm font-medium text-foreground">
                      <DateDisplay date={quotation.submission_date} />
                    </p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-xs text-muted-foreground mb-0.5">Created</p>
                    <p className="text-sm font-medium text-foreground">
                      <DateDisplay date={quotation.created_at} showRelative />
                    </p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                    Description
                  </p>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {quotation.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {vendor && (
              <Card className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    Vendor Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary text-sm font-bold shrink-0">
                      {vendor.vendor_name?.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{vendor.vendor_name}</p>
                      <p className="text-xs text-muted-foreground">{vendor.company_name}</p>
                    </div>
                    <Button variant="outline" size="sm" asChild className="ml-auto">
                      <Link href={`/vendors/${quotation.vendor_id}`}>View Profile</Link>
                    </Button>
                  </div>
                  {vendor.email_address && (
                    <a
                      href={`mailto:${vendor.email_address}`}
                      className="text-xs text-muted-foreground hover:text-foreground hover:underline"
                    >
                      {vendor.email_address}
                    </a>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right — status + timeline */}
          <div className="space-y-4">
            <StatusController
              quotationId={quotation.id}
              currentStatus={quotation.status}
              quotationTitle={quotation.quotation_title}
              onStatusChange={() => mutate()}
            />
            <QuotationTimeline quotation={quotation} />
          </div>
        </div>
      </div>
    </div>
  )
}
