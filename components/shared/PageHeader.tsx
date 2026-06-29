import { cn } from '@/lib/utils/cn'

interface PageHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <div className={cn(
      'flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-4 lg:px-6 lg:py-5 border-b border-border bg-background',
      className
    )}>
      <div className="min-w-0 flex-1">
        <h2 className="text-base lg:text-lg font-semibold text-foreground break-words">{title}</h2>
        {description && (
          <p className="text-xs lg:text-sm text-muted-foreground mt-0.5 break-words">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0 flex flex-wrap gap-2 items-center">{action}</div>}
    </div>
  )
}
