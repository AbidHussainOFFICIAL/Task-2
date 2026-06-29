import { TooltipProvider } from '@/components/ui/tooltip'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { BottomNav } from '@/components/layout/BottomNav'
import { OfflineBanner } from '@/components/shared'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Sidebar — hidden on mobile, visible lg+ */}
        <div className="hidden lg:flex lg:shrink-0">
          <Sidebar />
        </div>

        {/* Main content area */}
        <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto overflow-x-hidden pb-16 lg:pb-0">
            <div className="min-w-0 w-full">
              {children}
            </div>
          </main>
          <BottomNav />
        </div>
      </div>

      {/* Global offline detection */}
      <OfflineBanner />
    </TooltipProvider>
  )
}
