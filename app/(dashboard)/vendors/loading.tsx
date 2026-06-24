import { TableSkeleton } from '@/components/shared'
import { Skeleton } from '@/components/ui/skeleton'

export default function VendorsLoading() {
  return (
    <div className="p-4 lg:p-6 space-y-4 max-w-[1600px] mx-auto animate-pulse">
      {/* Header controls skeleton */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Skeleton className="h-9 w-full sm:max-w-xs rounded-lg" />
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-16 rounded-full" />
          ))}
        </div>
      </div>

      {/* Table card skeleton */}
      <div className="rounded-xl border bg-card shadow-card overflow-hidden">
        <TableSkeleton rows={8} cols={5} />
      </div>
    </div>
  )
}
