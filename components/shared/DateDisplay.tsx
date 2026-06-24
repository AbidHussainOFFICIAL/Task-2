'use client'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { formatDate, formatRelativeTime } from '@/lib/utils/date'
import { cn } from '@/lib/utils/cn'

interface DateDisplayProps {
  date: string | null | undefined
  format?: 'display' | 'displayLong' | 'displayWithTime'
  showRelative?: boolean
  className?: string
}

export function DateDisplay({
  date,
  format = 'display',
  showRelative = false,
  className,
}: DateDisplayProps) {
  if (!date) return <span className={cn('text-muted-foreground', className)}>—</span>

  const formatted = formatDate(date, format)
  const relative = formatRelativeTime(date)

  if (showRelative) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn('cursor-default text-muted-foreground text-sm', className)}>
            {relative}
          </span>
        </TooltipTrigger>
        <TooltipContent>{formatted}</TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={cn('cursor-default', className)}>{formatted}</span>
      </TooltipTrigger>
      <TooltipContent>{relative}</TooltipContent>
    </Tooltip>
  )
}
