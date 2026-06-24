'use client'

import { cn } from '@/lib/utils/cn'

interface FilterChip<T extends string> {
  value: T
  label: string
  count?: number
}

interface FilterChipsProps<T extends string> {
  chips: FilterChip<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
}

export function FilterChips<T extends string>({
  chips,
  value,
  onChange,
  className,
}: FilterChipsProps<T>) {
  return (
    <div className={cn('flex items-center gap-1.5 flex-wrap', className)}>
      {chips.map((chip) => (
        <button
          key={chip.value}
          onClick={() => onChange(chip.value)}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors',
            'border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            value === chip.value
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-background text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground'
          )}
        >
          {chip.label}
          {chip.count !== undefined && (
            <span className={cn(
              'rounded-full px-1.5 py-0.5 text-[10px] leading-none tabular-nums',
              value === chip.value ? 'bg-primary-foreground/20' : 'bg-muted'
            )}>
              {chip.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
