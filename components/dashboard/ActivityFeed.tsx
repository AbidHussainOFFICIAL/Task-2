'use client'

import { Building2, FileText, CheckCircle, XCircle, Edit, Trash2, ActivityIcon } from 'lucide-react'
import type { ActivityLogEntry } from '@/types'
import { DateDisplay } from '@/components/shared'
import { ActivitySkeleton } from '@/components/shared'
import { cn } from '@/lib/utils/cn'
import { ACTIVITY_EVENT_LABELS } from '@/lib/constants'

const EVENT_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  vendor_created: { icon: Building2,   color: 'text-status-active',    bg: 'bg-status-active-bg' },
  vendor_updated: { icon: Edit,         color: 'text-muted-foreground', bg: 'bg-muted' },
  vendor_deleted: { icon: Trash2,       color: 'text-destructive',      bg: 'bg-destructive/10' },
  quote_created:  { icon: FileText,     color: 'text-primary',          bg: 'bg-primary/10' },
  quote_submitted:{ icon: FileText,     color: 'text-primary',          bg: 'bg-primary/10' },
  quote_approved: { icon: CheckCircle,  color: 'text-status-approved',  bg: 'bg-status-approved-bg' },
  quote_rejected: { icon: XCircle,      color: 'text-status-rejected',  bg: 'bg-status-rejected-bg' },
  quote_updated:  { icon: Edit,         color: 'text-muted-foreground', bg: 'bg-muted' },
}

function getEventConfig(event: string) {
  return EVENT_CONFIG[event] ?? { icon: ActivityIcon, color: 'text-muted-foreground', bg: 'bg-muted' }
}

interface ActivityFeedProps {
  activities: ActivityLogEntry[]
  isLoading?: boolean
  className?: string
}

export function ActivityFeed({ activities, isLoading, className }: ActivityFeedProps) {
  if (isLoading) return <ActivitySkeleton rows={6} />

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <ActivityIcon className="h-8 w-8 text-muted-foreground/40 mb-2" />
        <p className="text-sm text-muted-foreground">No activity yet</p>
      </div>
    )
  }

  return (
    <ol className={cn('space-y-3', className)}>
      {activities.map((entry, index) => {
        const config = getEventConfig(entry.event)
        const Icon = config.icon
        const label = ACTIVITY_EVENT_LABELS[entry.event]

        return (
          <li key={entry.id} className="flex gap-3 min-w-0">
            {/* Icon */}
            <div className={cn(
              'flex h-7 w-7 shrink-0 items-center justify-center rounded-full mt-0.5',
              config.bg
            )}>
              <Icon className={cn('h-3.5 w-3.5', config.color)} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {label && (
                <p className={cn('text-[10px] uppercase font-semibold tracking-wider', config.color)}>
                  {label}
                </p>
              )}
              <p className="text-sm text-foreground leading-snug mt-0.5 line-clamp-2">
                {entry.message}
              </p>
              <DateDisplay
                date={entry.created_at}
                showRelative
                className="text-[11px] mt-0.5"
              />
            </div>

            {/* Connector line (not on last item) */}
            {index < activities.length - 1 && (
              <div className="absolute left-[15px] mt-7 w-px h-3 bg-border" aria-hidden />
            )}
          </li>
        )
      })}
    </ol>
  )
}
