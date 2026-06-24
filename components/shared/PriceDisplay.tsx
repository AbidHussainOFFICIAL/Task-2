import { cn } from '@/lib/utils/cn'
import { formatCurrency } from '@/lib/utils/currency'

interface PriceDisplayProps {
  amount: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
  currency?: string
}

export function PriceDisplay({ amount, className, size = 'md', currency = 'USD' }: PriceDisplayProps) {
  const formatted = formatCurrency(amount, currency)

  return (
    <span className={cn(
      'tabular-nums font-medium text-foreground',
      size === 'sm' && 'text-sm',
      size === 'md' && 'text-sm',
      size === 'lg' && 'text-2xl font-bold',
      className
    )}>
      {formatted}
    </span>
  )
}
