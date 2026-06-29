import { Skeleton } from '@/components/ui'
import { DetailSkeleton } from '@/components/shared'

export default function QuotationDetailLoading() {
  return (
    <div className="flex flex-col h-full animate-pulse">
      {/* Back nav bar skeleton */}
      <div className="px-4 lg:px-6 py-3 border-b border-border">
        <Skeleton className="h-8 w-36 rounded-md" />
      </div>

      {/* Action bar skeleton */}
      <div className="px-4 lg:px-6 py-3 border-b border-border flex items-center justify-between">
        <Skeleton className="h-6 w-24 rounded-full" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20 rounded-lg" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto w-full">
        {/* Primary info card */}
        <div className="rounded-xl border bg-card shadow-sm p-6">
          <DetailSkeleton />
        </div>

        {/* Side-by-side cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border bg-card shadow-sm p-6 space-y-3">
            <Skeleton className="h-4 w-32" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3.5 w-28" />
              </div>
            ))}
          </div>
          <div className="rounded-xl border bg-card shadow-sm p-6 space-y-3">
            <Skeleton className="h-4 w-32" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-5 w-5 rounded-full shrink-0 mt-0.5" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-3.5 w-[60%]" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
