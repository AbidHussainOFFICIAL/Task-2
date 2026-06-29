'use client'

import { Button } from '@/components/ui/button'
import { QuotationEditForm } from '@/components/quotations/QuotationEditForm'
import { useQuotation } from '@/hooks/useQuotations'

import { useParams, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

import { DetailSkeleton, ErrorCard } from '@/components/shared'

export default function EditQuotationPage() {
  const { id } = useParams<{ id: string }>()
  const { quotation, isLoading, error, isNotFound, mutate } = useQuotation(Number(id))

  if (isNotFound || (!isLoading && !quotation && !error)) {
    notFound()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Back nav */}
      <div className="px-4 lg:px-6 py-3 border-b border-border -mt-px">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href={`/quotations/${id}`}>
            <ChevronLeft className="h-4 w-4" />Back to Quotation
          </Link>
        </Button>
      </div>

      <div className="p-4 lg:p-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-foreground">Edit Quotation</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Only <strong>Pending</strong> quotations can be modified.
          </p>
        </div>

        {isLoading && <DetailSkeleton />}
        {error && (
          <ErrorCard
            title="Failed to load quotation"
            message={error}
            onRetry={() => mutate()}
          />
        )}
        {quotation && <QuotationEditForm quotation={quotation} />}
      </div>
    </div>
  )
}
