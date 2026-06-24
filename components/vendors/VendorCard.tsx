'use client'

import Link from 'next/link'
import { Mail, Phone, MapPin, Pencil, Trash2, Building2 } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { VendorStatusBadge, ConfirmModal, DateDisplay } from '@/components/shared'
import { deleteVendor, updateVendor } from '@/hooks/useVendors'
import type { Vendor } from '@/types'

interface VendorCardProps {
  vendor: Vendor
  onRefresh: () => void
}

export function VendorCard({ vendor, onRefresh }: VendorCardProps) {
  const router = useRouter()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [togglingStatus, setTogglingStatus] = useState(false)

  async function handleDelete() {
    const { error } = await deleteVendor(vendor.id)
    if (error) { toast.error(error); return }
    toast.success(`Vendor "${vendor.vendor_name}" removed`)
    router.push('/vendors')
  }

  async function handleToggleStatus() {
    setTogglingStatus(true)
    const newStatus = vendor.status === 'Active' ? 'Inactive' : 'Active'
    const { error } = await updateVendor(vendor.id, { status: newStatus })
    if (error) { toast.error(error) }
    else { toast.success(`Vendor marked as ${newStatus}`); onRefresh() }
    setTogglingStatus(false)
  }

  return (
    <>
      <Card className="shadow-card">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary text-lg font-bold">
                {vendor.vendor_name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">{vendor.vendor_name}</h2>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                  <Building2 className="h-3.5 w-3.5" />
                  {vendor.company_name}
                </div>
              </div>
            </div>
            <VendorStatusBadge status={vendor.status} />
          </div>

          <Separator className="my-5" />

          {/* Contact details */}
          <div className="space-y-3">
            <a
              href={`mailto:${vendor.email_address}`}
              className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted group-hover:bg-accent">
                <Mail className="h-3.5 w-3.5" />
              </div>
              {vendor.email_address}
            </a>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted">
                <Phone className="h-3.5 w-3.5" />
              </div>
              {vendor.contact_number}
            </div>
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted mt-0.5">
                <MapPin className="h-3.5 w-3.5" />
              </div>
              <span className="leading-relaxed">{vendor.business_address}</span>
            </div>
          </div>

          <Separator className="my-5" />

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-muted-foreground mb-0.5">Onboarded</p>
              <DateDisplay date={vendor.created_at} className="text-foreground font-medium" />
            </div>
            <div>
              <p className="text-muted-foreground mb-0.5">Last updated</p>
              <DateDisplay date={vendor.updated_at} showRelative className="text-foreground font-medium" />
            </div>
          </div>

          <Separator className="my-5" />

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button size="sm" variant="outline" asChild>
              <Link href={`/vendors/${vendor.id}/edit`}>
                <Pencil className="h-3.5 w-3.5" />Edit Profile
              </Link>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleToggleStatus}
              disabled={togglingStatus}
            >
              {togglingStatus ? 'Updating…' : vendor.status === 'Active' ? 'Mark Inactive' : 'Mark Active'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-destructive hover:text-destructive border-destructive/30 hover:border-destructive ml-auto"
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 className="h-3.5 w-3.5" />Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      <ConfirmModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        title="Delete Vendor"
        description={`Deleting "${vendor.vendor_name}" will permanently remove their profile and all associated quotations. This cannot be undone.`}
        confirmLabel="Delete Vendor"
        onConfirm={handleDelete}
      />
    </>
  )
}
