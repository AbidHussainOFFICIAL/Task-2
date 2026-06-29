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

function QuotationActions({
  q,
  onDelete,
  onStatus,
}: {
  q: Quotation
  onDelete: (q: Quotation) => void
  onStatus: (q: Quotation, status: 'Approved' | 'Rejected') => void
}) {
  const router = useRouter()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
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
              onClick={() => onStatus(q, 'Approved')}
            >
              <CheckCircle className="h-4 w-4" />Approve
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-status-rejected focus:text-status-rejected"
              onClick={() => onStatus(q, 'Rejected')}
            >
              <XCircle className="h-4 w-4" />Reject
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => onDelete(q)}
        >
          <Trash2 className="h-4 w-4" />Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
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
      {/* ── Mobile card list (hidden md+) ─────────────────── */}
      <div className="md:hidden space-y-3 px-1">
        {quotations.map((q) => (
          <div
            key={q.id}
            className="rounded-xl border border-border bg-card shadow-sm p-4 cursor-pointer active:scale-[0.99] transition-transform"
            onClick={() => router.push(`/quotations/${q.id}`)}
          >
            {/* Top row: title + actions */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground truncate">{q.quotation_title}</p>
                <code className="text-xs text-muted-foreground font-mono">{q.vendor_reference}</code>
              </div>
              <div onClick={(e) => e.stopPropagation()} className="shrink-0">
                <QuotationActions q={q} onDelete={setDeleteTarget} onStatus={handleQuickStatus} />
              </div>
            </div>

            {/* Vendor */}
            <p className="mt-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground/70">Vendor:</span>{' '}
              {q.vendors?.vendor_name ?? '—'}
              {q.vendors?.company_name ? ` · ${q.vendors.company_name}` : ''}
            </p>

            {/* Bottom row: amount + status + date */}
            <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
              <PriceDisplay amount={q.quotation_amount} />
              <div className="flex items-center gap-2">
                <QuotationStatusBadge status={q.status} />
                <span className="text-xs text-muted-foreground">
                  <DateDisplay date={q.submission_date} />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Desktop table (hidden below md) ──────────────── */}
      <div className="hidden md:block overflow-x-auto">
        <Table className="min-w-[600px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Title</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead className="hidden lg:table-cell">Reference</TableHead>
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
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  <div>
                    <p className="text-sm text-foreground">{q.vendors?.vendor_name ?? '—'}</p>
                    <p className="text-xs text-muted-foreground">{q.vendors?.company_name ?? ''}</p>
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
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
                  <QuotationActions q={q} onDelete={setDeleteTarget} onStatus={handleQuickStatus} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
