import type { Order } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Clock, AlertCircle, DollarSign, FileText, Calendar } from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"
import Link from "next/link"

interface OrderCardProps {
  order: Order
}

export function OrderCard({ order }: OrderCardProps) {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      available: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      in_progress: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      in_review: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
      revision: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      completed: "bg-green-500/10 text-green-500 border-green-500/20",
      canceled: "bg-gray-500/10 text-gray-500 border-gray-500/20",
      disputed: "bg-red-500/10 text-red-500 border-red-500/20",
    }
    return colors[status] || colors.pending
  }

  const getStatusLabel = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-slate-400" />
              <span className="text-xs text-slate-400">ID {order.orderNumber}</span>
              {order.isOverdue && (
                <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Overdue
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg text-slate-100 line-clamp-1">{order.title}</CardTitle>
          </div>
          <Badge className={getStatusColor(order.status)}>{getStatusLabel(order.status)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-400 text-xs mb-1">Type</p>
            <p className="text-slate-200 font-medium">{order.type}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs mb-1">Subject</p>
            <p className="text-slate-200 font-medium">{order.subject}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-400 text-xs mb-1">Pages/Slides</p>
            <p className="text-slate-200 font-medium">{order.pagesOrSlides}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs mb-1">Words</p>
            <p className="text-slate-200 font-medium">{order.words.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-green-500" />
            <span className="text-slate-200 font-semibold">
              {order.currency} {order.totalAmount.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Calendar className="h-4 w-4" />
            <span>{format(order.deadline, "MMM dd, HH:mm")}</span>
          </div>
        </div>

        {order.deadline && (
          <div className="text-xs text-slate-400 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Due {formatDistanceToNow(order.deadline, { addSuffix: true })}
          </div>
        )}

        <Link href={`/orders/${order.id}`}>
          <Button className="w-full bg-primary hover:bg-primary/90">View Details</Button>
        </Link>
      </CardContent>
    </Card>
  )
}
