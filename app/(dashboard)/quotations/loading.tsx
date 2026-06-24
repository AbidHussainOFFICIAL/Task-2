import { TableSkeleton } from '@/components/shared'
import { Skeleton } from '@/components/ui/skeleton'

export default function QuotationsLoading() {
  return (
    <div className="p-4 lg:p-6 space-y-4 max-w-[1600px] mx-auto animate-pulse">
      {/* Header controls skeleton */}
      <div className="flex flex-wrap gap-3">
        <Skeleton className="h-9 w-full sm:max-w-xs rounded-lg" />
        <Skeleton className="h-9 w-40 rounded-lg" />
        <Skeleton className="h-9 w-32 rounded-lg" />
        <Skeleton className="h-9 w-28 rounded-lg" />
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>

      {/* Table card skeleton */}
      <div className="rounded-xl border bg-card shadow-card overflow-hidden">
        <TableSkeleton rows={8} cols={5} />
      </div>
    </div>
  )
}
