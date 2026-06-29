import { Skeleton } from '@/components/ui'
import { DetailSkeleton } from '@/components/shared'

export default function VendorDetailLoading() {
  return (
    <div className="flex flex-col h-full animate-pulse">
      {/* Back nav bar skeleton */}
      <div className="px-4 lg:px-6 py-3 border-b border-border">
        <Skeleton className="h-8 w-32 rounded-md" />
      </div>

      {/* Main content skeleton */}
      <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto w-full">
        {/* Header card */}
        <div className="rounded-xl border bg-card shadow-sm p-6">
          <DetailSkeleton />
        </div>

        {/* Tabs skeleton */}
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-lg" />
          ))}
        </div>

        {/* Tab content / table skeleton */}
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-4 py-3 border-b border-border last:border-0"
            >
              <Skeleton className="h-4 w-[30%]" />
              <Skeleton className="h-4 w-[20%]" />
              <Skeleton className="h-4 w-[15%] ml-auto" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
