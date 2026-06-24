'use client'

import { CheckCircle, Clock, XCircle, FilePlus } from 'lucide-react'
import type { Quotation } from '@/types'
import { formatDate, formatRelativeTime } from '@/lib/utils/date'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils/cn'

interface TimelineEvent {
  label: string
  date: string | null
  icon: React.ElementType
  iconClass: string
  bgClass: string
  active: boolean
}

function buildTimeline(q: Quotation): TimelineEvent[] {
  return [
    {
      label: 'Quotation Created',
      date: q.created_at,
      icon: FilePlus,
      iconClass: 'text-primary',
      bgClass: 'bg-primary/10',
      active: true,
    },
    {
      label: 'Under Review',
      date: q.status === 'Pending' ? q.updated_at : null,
      icon: Clock,
      iconClass: 'text-status-pending',
      bgClass: 'bg-status-pending-bg',
      active: q.status === 'Pending',
    },
    {
      label: q.status === 'Rejected' ? 'Rejected' : 'Approved',
      date: q.status !== 'Pending' ? q.updated_at : null,
      icon: q.status === 'Rejected' ? XCircle : CheckCircle,
      iconClass: q.status === 'Rejected' ? 'text-status-rejected' : 'text-status-approved',
      bgClass: q.status === 'Rejected' ? 'bg-status-rejected-bg' : 'bg-status-approved-bg',
      active: q.status !== 'Pending',
    },
  ]
}

interface QuotationTimelineProps {
  quotation: Quotation
}

export function QuotationTimeline({ quotation }: QuotationTimelineProps) {
  const events = buildTimeline(quotation)

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">Audit Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="relative space-y-5">
          {events.map((event, i) => (
            <li key={i} className={cn('flex gap-3', !event.active && 'opacity-40')}>
              <div className={cn(
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-full mt-0.5',
                event.active ? event.bgClass : 'bg-muted'
              )}>
                <event.icon className={cn('h-3.5 w-3.5', event.active ? event.iconClass : 'text-muted-foreground')} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{event.label}</p>
                {event.date && event.active ? (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatDate(event.date, 'displayWithTime')}
                    <span className="ml-2 opacity-70">({formatRelativeTime(event.date)})</span>
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-0.5">—</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  )
}
