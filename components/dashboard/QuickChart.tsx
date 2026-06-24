'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { Quotation } from '@/types'

interface QuickChartProps {
  quotations: Quotation[]
  isLoading?: boolean
}

interface MonthData {
  month: string
  Pending: number
  Approved: number
  Rejected: number
}

function buildMonthlyData(quotations: Quotation[]): MonthData[] {
  const months: Record<string, MonthData> = {}
  const now = new Date()

  // Build last 6 months
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = d.toLocaleString('default', { month: 'short', year: '2-digit' })
    months[key] = { month: key, Pending: 0, Approved: 0, Rejected: 0 }
  }

  // Bucket quotations
  quotations.forEach((q) => {
    const d = new Date(q.created_at)
    const key = d.toLocaleString('default', { month: 'short', year: '2-digit' })
    if (months[key]) {
      months[key][q.status as keyof Omit<MonthData, 'month'>]++
    }
  })

  return Object.values(months)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border bg-popover p-3 shadow-md text-sm">
      <p className="font-medium text-foreground mb-1">{label}</p>
      {payload.map((entry: { name: string; value: number; color: string }) => (
        <div key={entry.name} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-medium text-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

export function QuickChart({ quotations, isLoading }: QuickChartProps) {
  const data = buildMonthlyData(quotations)

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Quotation Activity</CardTitle>
        <CardDescription>Last 6 months by status</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[180px] flex items-end gap-2 px-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="flex-1 rounded-sm" style={{ height: `${40 + Math.random() * 80}px` }} />
            ))}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={data} barSize={8} barGap={2} barCategoryGap="35%">
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis hide allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted)/0.4)', radius: 4 }} />
              <Bar dataKey="Approved" fill="hsl(var(--status-approved))" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Pending"  fill="hsl(var(--status-pending))"  radius={[3, 3, 0, 0]} />
              <Bar dataKey="Rejected" fill="hsl(var(--status-rejected))" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

// Suppress unused import warning
