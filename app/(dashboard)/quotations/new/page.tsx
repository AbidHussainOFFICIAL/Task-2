import { Suspense } from 'react'
import type { Metadata } from 'next'
import { QuotationForm } from '@/components/quotations/QuotationForm'
import { TableSkeleton } from '@/components/shared'

export const metadata: Metadata = { title: 'New Quotation' }

export default function NewQuotationPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 lg:p-6">
        <Suspense fallback={<TableSkeleton rows={4} cols={2} />}>
          <QuotationForm />
        </Suspense>
      </div>
    </div>
  )
}
