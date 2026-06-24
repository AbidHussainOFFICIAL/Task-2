'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { MoreHorizontal, Eye, Trash2, CheckCircle, XCircle } from 'lucide-react'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
  QuotationStatusBadge, PriceDisplay, DateDisplay,
  ConfirmModal, TableSkeleton, EmptyState,
} from '@/components/shared'
import { deleteQuotation, updateQuotationStatus } from '@/hooks/useQuotations'
import type { Quotation } from '@/types'
import { FileText } from 'lucide-react'

interface QuotationTableProps {
  quotations: Quotation[]
  isLoading?: boolean
  onRefresh: () => void
}

export function QuotationTable({ quotations, isLoading, onRefresh }: QuotationTableProps) {
  const router = useRouter()
  const [deleteTarget, setDeleteTarget] = useState<Quotation | null>(null)

  async function handleDelete() {
    if (!deleteTarget) return
    const { error } = await deleteQuotation(deleteTarget.id)
    if (error) { toast.error(error); return }
    toast.success(`Quotation "${deleteTarget.quotation_title}" deleted`)
    onRefresh()
  }

  async function handleQuickStatus(q: Quotation, status: 'Approved' | 'Rejected') {
    const { error } = await updateQuotationStatus(q.id, status)
    if (error) { toast.error(error); return }
    toast.success(`Quotation ${status.toLowerCase()}`)
    onRefresh()
  }

  if (isLoading) return <TableSkeleton rows={8} cols={6} />

  if (quotations.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No quotations found"
        description="No quotations match your current filters. Create a new quotation to get started."
        action={{ label: 'Create Quotation', href: '/quotations/new' }}
      />
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Title</TableHead>
            <TableHead className="hidden sm:table-cell">Vendor</TableHead>
            <TableHead className="hidden md:table-cell">Reference</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden lg:table-cell">Date</TableHead>
            <TableHead className="w-[52px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotations.map((q) => (
            <TableRow
              key={q.id}
              className="cursor-pointer"
              onClick={() => router.push(`/quotations/${q.id}`)}
            >
              <TableCell>
                <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
                  {q.quotation_title}
                </p>
                <p className="text-xs text-muted-foreground sm:hidden mt-0.5">
                  {q.vendors?.vendor_name ?? '—'}
                </p>
              </TableCell>
              <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                <div>
                  <p className="text-sm text-foreground">{q.vendors?.vendor_name ?? '—'}</p>
                  <p className="text-xs text-muted-foreground">{q.vendors?.company_name ?? ''}</p>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                  {q.vendor_reference}
                </code>
              </TableCell>
              <TableCell>
                <PriceDisplay amount={q.quotation_amount} />
              </TableCell>
              <TableCell>
                <QuotationStatusBadge status={q.status} />
              </TableCell>
              <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                <DateDisplay date={q.submission_date} />
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
                    <DropdownMenuItem onClick={() => router.push(`/quotations/${q.id}`)}>
                      <Eye className="h-4 w-4" />View Detail
                    </DropdownMenuItem>
                    {q.status === 'Pending' && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-status-approved focus:text-status-approved"
                          onClick={() => handleQuickStatus(q, 'Approved')}
                        >
                          <CheckCircle className="h-4 w-4" />Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-status-rejected focus:text-status-rejected"
                          onClick={() => handleQuickStatus(q, 'Rejected')}
                        >
                          <XCircle className="h-4 w-4" />Reject
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => setDeleteTarget(q)}
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
        title="Delete Quotation"
        description={`Delete "${deleteTarget?.quotation_title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </>
  )
}
