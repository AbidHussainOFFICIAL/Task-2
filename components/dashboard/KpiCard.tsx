'use client'

import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Card, CardContent } from '@/components/ui/card'

interface KpiCardProps {
  title: string
  value: number
  icon: LucideIcon
  description?: string
  colorClass?: string
  iconBgClass?: string
  trend?: { value: number; label: string }
}

export function KpiCard({
  title,
  value,
  icon: Icon,
  description,
  colorClass = 'text-foreground',
  iconBgClass = 'bg-primary/10',
}: KpiCardProps) {
  return (
    <Card className="shadow-card hover:shadow-card-hover transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider truncate">
              {title}
            </p>
            <p className={cn('text-3xl font-bold mt-1.5 tabular-nums', colorClass)}>
              {value.toLocaleString()}
            </p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', iconBgClass)}>
            <Icon className={cn('h-5 w-5', colorClass)} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
