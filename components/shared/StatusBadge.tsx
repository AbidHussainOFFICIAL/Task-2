import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils/cn'
import type { VendorStatus, QuotationStatus } from '@/types'

interface VendorStatusBadgeProps {
  status: VendorStatus
  className?: string
}

export function VendorStatusBadge({ status, className }: VendorStatusBadgeProps) {
  return (
    <Badge
      variant={status === 'Active' ? 'active' : 'inactive'}
      className={cn('text-xs font-medium', className)}
    >
      <span className={cn(
        'mr-1.5 inline-block h-1.5 w-1.5 rounded-full',
        status === 'Active' ? 'bg-status-active' : 'bg-status-inactive'
      )} />
      {status}
    </Badge>
  )
}

interface QuotationStatusBadgeProps {
  status: QuotationStatus
  className?: string
}

const STATUS_MAP: Record<QuotationStatus, { variant: 'pending' | 'approved' | 'rejected'; dot: string }> = {
  Pending:  { variant: 'pending',  dot: 'bg-status-pending' },
  Approved: { variant: 'approved', dot: 'bg-status-approved' },
  Rejected: { variant: 'rejected', dot: 'bg-status-rejected' },
}

export function QuotationStatusBadge({ status, className }: QuotationStatusBadgeProps) {
  const { variant, dot } = STATUS_MAP[status]
  return (
    <Badge variant={variant} className={cn('text-xs font-medium', className)}>
      <span className={cn('mr-1.5 inline-block h-1.5 w-1.5 rounded-full', dot)} />
      {status}
    </Badge>
  )
}
