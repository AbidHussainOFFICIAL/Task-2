import { Skeleton } from '@/components/ui/skeleton'

export default function AccountLoading() {
  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-2xl animate-pulse">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="rounded-xl border bg-card p-6 space-y-5 shadow-card">
          {/* Card header */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-36" />
            </div>
          </div>

          {/* Form fields */}
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-16" />
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  )
}
