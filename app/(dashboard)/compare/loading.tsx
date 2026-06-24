import { Skeleton } from '@/components/ui/skeleton'

export default function CompareLoading() {
  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto animate-pulse">
      {/* Controls card skeleton */}
      <div className="rounded-xl border bg-card p-4 shadow-card">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
          <div className="space-y-1.5 w-full max-w-xs">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-36 rounded-lg" />
            <Skeleton className="h-9 w-24 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Grid of comparison cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-5 shadow-card space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-40" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-6 w-28" />
            </div>
            <div className="space-y-2 pt-2 border-t border-border">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
