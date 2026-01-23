"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, FileText, MessageSquare, Loader, AlertTriangle, Eye } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { bidService } from "@/lib/api/bid.service"
import { orderService } from "@/lib/api/order.service"
import type { Bid, Order } from "@/lib/types"
// Updated imports to match the second file's date handling
import { format, isValid, parseISO } from "date-fns"

interface BidWithOrder extends Bid {
  order?: Order
}

const BID_STATUS_COLORS: Record<string, string> = {
  pending: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  accepted: "bg-green-500/20 text-green-400 border-green-500/30",
  rejected: "bg-red-500/20 text-red-400 border-red-500/30",
  withdrawn: "bg-slate-500/20 text-slate-400 border-slate-500/30",
}

export default function WriterBidsPage() {
  const { user } = useAuth()
  const [bids, setBids] = useState<BidWithOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTab, setSelectedTab] = useState("all")

  useEffect(() => {
    const fetchBids = async () => {
      if (!user?.id) return

      try {
        setLoading(true)
        setError(null)
        const fetchedBids = await bidService.getBidsByWriter(Number(user.id))

        const bidsWithOrders = await Promise.all(
          fetchedBids.map(async (bid) => {
            try {
              const order = await orderService.getOrderById(Number(bid.orderId))
              return { ...bid, order }
            } catch (err) {
              return bid
            }
          })
        )

        setBids(bidsWithOrders)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load bids")
        setBids([])
      } finally {
        setLoading(false)
      }
    }

    fetchBids()
  }, [user?.id])

  const filteredBids = bids.filter((bid) => {
    if (selectedTab === "all") return true
    return bid.status === selectedTab
  })

  const stats = {
    total: bids.length,
    pending: bids.filter((b) => b.status === "pending").length,
    accepted: bids.filter((b) => b.status === "accepted").length,
    rejected: bids.filter((b) => b.status === "rejected").length,
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Bids</h1>
            <p className="text-slate-400 mt-1">Track and manage your placed bids on orders</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="pt-6 text-center">
              <p className="text-slate-400 text-sm mb-2">Total Bids</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="pt-6 text-center">
              <p className="text-orange-400 text-sm mb-2">Pending</p>
              <p className="text-3xl font-bold text-orange-400">{stats.pending}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="pt-6 text-center">
              <p className="text-green-400 text-sm mb-2">Accepted</p>
              <p className="text-3xl font-bold text-green-400">{stats.accepted}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="pt-6 text-center">
              <p className="text-red-400 text-sm mb-2">Rejected</p>
              <p className="text-3xl font-bold text-red-400">{stats.rejected}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs and Content */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle>Bids</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-slate-800">
                <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
                <TabsTrigger value="accepted">Accepted ({stats.accepted})</TabsTrigger>
                <TabsTrigger value="rejected">Rejected ({stats.rejected})</TabsTrigger>
              </TabsList>

              <TabsContent value={selectedTab} className="mt-6 space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader className="h-6 w-6 animate-spin text-blue-500" />
                  </div>
                ) : error ? (
                  <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    <p className="text-red-400">{error}</p>
                  </div>
                ) : filteredBids.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">No bids found</p>
                  </div>
                ) : (
                  filteredBids.map((bid) => {
                    // DATE HANDLING LOGIC (Similar to File 2)
                    const submittedDate = bid.submittedAt
                      ? bid.submittedAt instanceof Date
                        ? bid.submittedAt
                        : new Date(bid.submittedAt)
                      : null

                    const deadlineDate = bid.order?.deadline
                      ? bid.order.deadline instanceof Date
                        ? bid.order.deadline
                        : new Date(bid.order.deadline)
                      : null

                    return (
                      <div
                        key={bid.id}
                        className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-colors"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Bid Info */}
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-lg font-semibold mb-2">{bid.order?.title || "Order"}</h3>
                              <p className="text-slate-400 text-sm line-clamp-2">{bid.order?.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <p className="text-xs text-slate-400 mb-1">Bid Amount</p>
                                <p className="font-bold text-green-400">
                                  {bid.currency} {bid.bidAmount}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-400 mb-1">Delivery Hours</p>
                                <p className="font-bold flex items-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  {bid.deliveryHours}h
                                </p>
                              </div>
                            </div>

                            <div>
                              <p className="text-xs text-slate-400 mb-2">Cover Letter</p>
                              <p className="text-sm text-slate-300 line-clamp-3">{bid.coverLetter}</p>
                            </div>

                            <div>
                              <p className="text-xs text-slate-400 mb-2">Status</p>
                              <Badge className={`${BID_STATUS_COLORS[bid.status] || "bg-slate-500/20"} text-xs py-1`}>
                                {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                              </Badge>
                            </div>

                            <p className="text-xs text-slate-500">
                              Submitted:{" "}
                              {submittedDate && isValid(submittedDate)
                                ? format(submittedDate, "MMM dd, yyyy HH:mm")
                                : "N/A"}
                            </p>
                          </div>

                          {/* Order Details */}
                          <div className="space-y-4">
                            <div className="bg-slate-900 rounded-lg p-4 space-y-3">
                              <h4 className="font-semibold text-sm">Order Details</h4>

                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-slate-400">Budget</span>
                                  <span className="font-semibold">
                                    {bid.order?.currency} {bid.order?.totalAmount}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-400">Type</span>
                                  <span className="font-semibold">{bid.order?.type}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-400">Subject</span>
                                  <span className="font-semibold">{bid.order?.subject}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-400">Deadline</span>
                                  <span className="font-semibold">
                                    {deadlineDate && isValid(deadlineDate)
                                      ? format(deadlineDate, "MMM dd, yyyy")
                                      : "—"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Link href={`/orders/${bid.orderId}`} className="flex-1">
                                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Order
                                </Button>
                              </Link>
                              <Link href={`/messages?orderId=${bid.orderId}`} className="flex-1">
                                <Button
                                  variant="outline"
                                  className="w-full border-slate-600 hover:bg-slate-800 bg-transparent"
                                >
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Message
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}