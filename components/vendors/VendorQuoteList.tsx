'use client'

import Link from 'next/link'
import { FileText, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { QuotationStatusBadge, PriceDisplay, DateDisplay, EmptyState } from '@/components/shared'

interface QuoteRow {
  id: number
  quotation_title: string
  vendor_reference: string
  quotation_amount: number
  submission_date: string
  status: 'Pending' | 'Approved' | 'Rejected'
  created_at: string
}

interface VendorQuoteListProps {
  quotes: QuoteRow[]
  vendorId: number
}

export function VendorQuoteList({ quotes, vendorId }: VendorQuoteListProps) {
  if (quotes.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No quotations yet"
        description="This vendor has not submitted any quotations."
        action={{ label: 'Create Quotation', href: `/quotations/new?vendor_id=${vendorId}` }}
      />
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between px-1 mb-3">
        <p className="text-sm text-muted-foreground">{quotes.length} quotation{quotes.length !== 1 ? 's' : ''}</p>
        <Button size="sm" variant="outline" asChild>
          <Link href={`/quotations/new?vendor_id=${vendorId}`}>
            <Plus className="h-3.5 w-3.5" />New Quotation
          </Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Title</TableHead>
            <TableHead className="hidden sm:table-cell">Reference</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotes.map((q) => (
            <TableRow key={q.id} >
              <TableCell>
                <Link
                  href={`/quotations/${q.id}`}
                  className="text-sm font-medium text-foreground hover:text-primary hover:underline truncate max-w-[200px] block"
                  onClick={(e) => e.stopPropagation()}
                >
                  {q.quotation_title}
                </Link>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
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
              <TableCell className="hidden md:table-cell">
                <DateDisplay date={q.submission_date} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
