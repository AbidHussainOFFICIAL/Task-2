import type { Metadata } from 'next'
import { VendorForm } from '@/components/vendors'

export const metadata: Metadata = { title: 'Add Vendor' }

export default function NewVendorPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 lg:p-6">
        <VendorForm mode="create" />
      </div>
    </div>
  )
}
