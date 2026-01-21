import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminBidsLoading() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <Skeleton className="h-9 w-48 bg-slate-800" />
          <Skeleton className="h-5 w-72 mt-2 bg-slate-800" />
        </div>

        <div className="flex gap-2">
          <Skeleton className="h-10 w-24 bg-slate-800" />
          <Skeleton className="h-10 w-24 bg-slate-800" />
          <Skeleton className="h-10 w-24 bg-slate-800" />
          <Skeleton className="h-10 w-24 bg-slate-800" />
        </div>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <Skeleton className="h-6 w-32 bg-slate-800" />
            <Skeleton className="h-4 w-64 bg-slate-800" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full bg-slate-800" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full bg-slate-800" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
