'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DetailSkeleton, ErrorCard } from '@/components/shared'
import { VendorForm } from '@/components/vendors'
import { useVendor } from '@/hooks/useVendors'

export default function EditVendorPage() {
  const { id } = useParams<{ id: string }>()
  const { vendor, isLoading, error, mutate } = useVendor(Number(id))

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 lg:px-6 py-3 border-b border-border -mt-px">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href={`/vendors/${id}`}>
            <ChevronLeft className="h-4 w-4" />Back to Profile
          </Link>
        </Button>
      </div>

      <div className="p-4 lg:p-6">
        {isLoading && <DetailSkeleton />}
        {error && (
          <ErrorCard
            title="Vendor not found"
            message={error}
            onRetry={() => mutate()}
          />
        )}
        {vendor && <VendorForm vendor={vendor} mode="edit" />}
      </div>
    </div>
  )
}
