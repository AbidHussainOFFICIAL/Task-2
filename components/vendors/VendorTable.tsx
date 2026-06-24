'use client'

import { ExternalLink, MoreHorizontal, Pencil, Trash2, Eye } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { VendorStatusBadge, ConfirmModal, DateDisplay, TableSkeleton, EmptyState } from '@/components/shared'
import { deleteVendor } from '@/hooks/useVendors'
import type { Vendor } from '@/types'
import { Building2 } from 'lucide-react'

interface VendorTableProps {
  vendors: Vendor[]
  isLoading?: boolean
  onRefresh: () => void
}

export function VendorTable({ vendors, isLoading, onRefresh }: VendorTableProps) {
  const router = useRouter()
  const [deleteTarget, setDeleteTarget] = useState<Vendor | null>(null)

  async function handleDelete() {
    if (!deleteTarget) return
    const { error } = await deleteVendor(deleteTarget.id)
    if (error) { toast.error(error); return }
    toast.success(`Vendor "${deleteTarget.vendor_name}" and their quotations have been removed`)
    onRefresh()
  }

  if (isLoading) return <TableSkeleton rows={8} cols={6} />

  if (vendors.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title="No vendors found"
        description="No vendors match your current filters. Try adjusting your search or add a new vendor."
        action={{ label: 'Add Vendor', href: '/vendors/new' }}
      />
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Vendor</TableHead>
            <TableHead className="hidden sm:table-cell">Company</TableHead>
            <TableHead className="hidden md:table-cell">Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden lg:table-cell">Joined</TableHead>
            <TableHead className="w-[52px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {vendors.map((vendor) => (
            <TableRow
              key={vendor.id}
              className="cursor-pointer"
              onClick={() => router.push(`/vendors/${vendor.id}`)}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                    {vendor.vendor_name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{vendor.vendor_name}</p>
                    <p className="text-xs text-muted-foreground sm:hidden truncate">{vendor.company_name}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                {vendor.company_name}
              </TableCell>
              <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                <a
                  href={`mailto:${vendor.email_address}`}
                  onClick={(e) => e.stopPropagation()}
                  className="hover:text-foreground hover:underline flex items-center gap-1"
                >
                  {vendor.email_address}
                  <ExternalLink className="h-3 w-3 opacity-50" />
                </a>
              </TableCell>
              <TableCell>
                <VendorStatusBadge status={vendor.status} />
              </TableCell>
              <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                <DateDisplay date={vendor.created_at} />
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push(`/vendors/${vendor.id}`)}>
                      <Eye className="h-4 w-4" />View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/vendors/${vendor.id}/edit`)}>
                      <Pencil className="h-4 w-4" />Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => setDeleteTarget(vendor)}
                    >
                      <Trash2 className="h-4 w-4" />Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ConfirmModal
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete Vendor"
        description={`Are you sure you want to delete "${deleteTarget?.vendor_name}"? This will also permanently delete all their quotations. This action cannot be undone.`}
        confirmLabel="Delete Vendor"
        onConfirm={handleDelete}
      />
    </>
  )
}
