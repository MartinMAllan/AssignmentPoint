import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="h-20 bg-slate-800 rounded-lg animate-pulse" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-slate-900 border-slate-800">
              <CardHeader>
                <div className="h-16 bg-slate-800 rounded animate-pulse" />
              </CardHeader>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <div className="h-48 bg-slate-800 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
