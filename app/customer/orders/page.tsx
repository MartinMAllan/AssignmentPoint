"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, DollarSign, FileText, Users } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { orderService } from "@/lib/api/order.service"
import { bidService } from "@/lib/api/bid.service"
import type { Order, Bid } from "@/lib/types"

export default function CustomerOrdersPage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const statusFilter = searchParams?.get("status")
  const [orders, setOrders] = useState<Order[]>([])
  const [bids, setBids] = useState<Bid[]>([])
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        if (user?.id) {
          const ordersData = await orderService.getOrdersByCustomer(Number(user.id))
          setOrders(ordersData)
          const allBids: Bid[] = []
          for (const order of ordersData) {
            try {
              const orderBidsData = await bidService.getBidsByOrder(Number(order.id))
              allBids.push(...orderBidsData)
            } catch (err) {
              console.error(`[v0] Error loading bids for order ${order.id}:`, err)
            }
          }
          setBids(allBids)
        }
      } catch (err) {
        console.error("[v0] Error loading orders:", err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user?.id])

  const customerOrders = orders.filter((o) => !statusFilter || o.status === statusFilter)

  const getOrderBids = (orderId: string | number) => {
    const orderIdString = orderId.toString()
    return bids.filter((bid) => bid.orderId.toString() === orderIdString)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-slate-400">Loading orders...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-100">My Orders</h1>
            <p className="text-slate-400 mt-1">Manage your orders and review writer bids</p>
          </div>
          <Link href="/customer/post-order">
            <Button>Post New Order</Button>
          </Link>
        </div>

        <div className="grid gap-4">
          {customerOrders.length === 0 ? (
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-slate-600 mb-4" />
                <h3 className="text-lg font-semibold text-slate-300 mb-2">No orders found</h3>
                <p className="text-slate-500 text-center">Post a new order to get started</p>
              </CardContent>
            </Card>
          ) : (
            customerOrders.map((order) => {
              const orderBids = getOrderBids(order.id)
              const isExpanded = selectedOrder === order.id.toString()

              return (
                <Card key={order.id} className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-slate-100">{order.title}</CardTitle>
                        <p className="text-sm text-slate-400">Order #{order.orderNumber}</p>
                      </div>
                      <Badge
                        variant={
                          order.status === "available"
                            ? "default"
                            : order.status === "completed"
                              ? "default"
                              : "secondary"
                        }
                        className={
                          order.status === "available"
                            ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                            : order.status === "completed"
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : "bg-purple-500/20 text-purple-400 border-purple-500/30"
                        }
                      >
                        {order.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-300">{order.subject}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-300">{new Date(order.deadline).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-300">${order.totalAmount}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-300">{orderBids.length} Bids</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/orders/${order.id}`} className="flex-1">
                        <Button
                          variant="outline"
                          className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
                        >
                          View Details
                        </Button>
                      </Link>
                      {order.status === "available" && orderBids.length > 0 && (
                        <Button
                          onClick={() => setSelectedOrder(isExpanded ? null : order.id.toString())}
                          className="flex-1"
                        >
                          {isExpanded ? "Hide Bids" : `View ${orderBids.length} Bids`}
                        </Button>
                      )}
                    </div>

                    {isExpanded && orderBids.length > 0 && (
                      <div className="border-t border-slate-800 pt-4 space-y-3">
                        <h4 className="font-medium text-slate-200">Writer Bids</h4>
                        {orderBids.map((bid) => (
                          <div key={bid.id} className="bg-slate-800 p-4 rounded-lg space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium text-slate-200">Writer #{bid.writerId}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-slate-100">${bid.bidAmount}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" className="flex-1">
                                Accept Bid
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-slate-700 text-slate-300 bg-transparent"
                              >
                                Message Writer
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
