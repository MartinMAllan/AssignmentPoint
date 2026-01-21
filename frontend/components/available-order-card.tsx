"use client"

import type { Order } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import {
  Clock,
  FileText,
  Calendar,
  BookOpen,
  GraduationCap,
  Sparkles,
} from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"
import { useRouter } from "next/navigation"

/**
 * Safely convert backend date string → Date
 */
function parseDate(value?: string | null): Date | null {
  if (!value) return null
  const d = new Date(value)
  return isNaN(d.getTime()) ? null : d
}

interface AvailableOrderCardProps {
  order: Order
  onBidSubmit?: (orderId: string, bidAmount: number, coverLetter: string) => void
}

export function AvailableOrderCard({ order }: AvailableOrderCardProps) {
  const router = useRouter()

  const deadlineDate = parseDate(order.deadline)

  const writerEarning = order.customerIsReturning
    ? order.totalAmount * 0.45
    : order.totalAmount * 0.4

  const handlePlaceBid = () => {
    router.push(`/available-orders/${order.id}`)
  }

  return (
    <Card className="bg-slate-900 border-slate-800 hover:border-primary/50 transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-slate-400" />
            <span className="text-xs text-slate-400">
              ID {order.orderNumber}
            </span>

            {order.customerIsReturning && (
              <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                <Sparkles className="h-3 w-3 mr-1" />
                Returning Client
              </Badge>
            )}
          </div>

          <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            Available
          </Badge>
        </div>

        <CardTitle className="text-lg text-slate-100 leading-tight">
          {order.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-slate-300 line-clamp-2">
          {order.description}
        </p>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Subject</p>
              <p className="text-slate-200 font-medium">
                {order.subject}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Level</p>
              <p className="text-slate-200 font-medium">
                {order.educationLevel}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-sm pt-2 border-t border-slate-800">
          <div>
            <p className="text-slate-500 text-xs mb-1">Pages</p>
            <p className="text-slate-200 font-semibold">
              {order.pagesOrSlides}
            </p>
          </div>

          <div>
            <p className="text-slate-500 text-xs mb-1">Words</p>
            <p className="text-slate-200 font-semibold">
              {order.words.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-slate-500 text-xs mb-1">Sources</p>
            <p className="text-slate-200 font-semibold">
              {order.sourcesRequired}
            </p>
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Total Budget</span>
            <span className="text-lg font-bold text-slate-100">
              {order.currency} {order.totalAmount.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">
              Your Earning ({order.customerIsReturning ? "45%" : "40%"})
            </span>
            <span className="text-lg font-bold text-green-500">
              {order.currency} {writerEarning.toFixed(2)}
            </span>
          </div>
        </div>

        {deadlineDate && (
          <>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-slate-400" />
              <div className="flex-1">
                <p className="text-xs text-slate-500">Deadline</p>
                <p className="text-slate-200 font-medium">
                  {format(deadlineDate, "MMM dd, yyyy 'at' HH:mm")}
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-400 flex items-center gap-1 bg-slate-800/50 rounded-md p-2">
              <Clock className="h-3 w-3" />
              Due {formatDistanceToNow(deadlineDate, { addSuffix: true })}
            </div>
          </>
        )}

        <Button
          onClick={handlePlaceBid}
          className="w-full bg-primary hover:bg-primary/90"
          size="lg"
        >
          Place Bid
        </Button>
      </CardContent>
    </Card>
  )
}
