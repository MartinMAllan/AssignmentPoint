"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, DollarSign, FileText, Users, Loader, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { orderService } from "@/lib/api/order.service"
import type { Order } from "@/lib/types"

const ORDER_STATUSES = [
  { value: "available", label: "AVAILABLE" },
  { value: "pending", label: "PENDING" },
  { value: "in_progress", label: "IN PROGRESS" },
  { value: "in_review", label: "IN REVIEW" },
  { value: "revision", label: "REVISION" },
  { value: "completed", label: "COMPLETED" },
  { value: "canceled", label: "CANCELED" },
  { value: "disputed", label: "DISPUTED" },
]

export default function CustomerOrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTab, setSelectedTab] = useState("available")
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return

      try {
        setLoading(true)
        setError(null)
        console.log("[v0] Fetching orders for customer:", user?.id)
        
        const fetchedOrders = await orderService.getOrdersByCustomer(Number(user.id))
        
        console.log("[v0] Orders fetched successfully:", fetchedOrders.length)
        setOrders(fetchedOrders)
      } catch (err) {
        console.error("[v0] Error fetching orders:", err)
        const errorMessage = err instanceof Error ? err.message : "Failed to load orders"
        setError(errorMessage)
        setOrders([])
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user?.id])

  const getStatusDisplay = (status: string): string => {
    return status.replace(/_/g, " ").toUpperCase()
  }

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase()
    switch (statusLower) {
      case "available":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
      case "pending":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "in_progress":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "in_review":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "revision":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "canceled":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "disputed":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const filteredOrders = orders.filter((order) => {
    const orderStatus = order.status?.toLowerCase().replace(/ /g, "_")
    return orderStatus === selectedTab
  })

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <Loader className="h-5 w-5 animate-spin text-blue-500" />
            <p className="text-slate-400">Loading your orders...</p>
          </div>
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

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <div className="overflow-x-auto">
            <TabsList className="inline-flex w-full min-w-max bg-slate-900 border-b border-slate-800">
              {ORDER_STATUSES.map((status) => (
                <TabsTrigger
                  key={status.value}
                  value={status.value}
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none text-xs md:text-sm whitespace-nowrap px-3 py-2"
                >
                  {status.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {ORDER_STATUSES.map((status) => (
            <TabsContent key={status.value} value={status.value} className="space-y-4 mt-6">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-400">No orders found in {status.label} status</p>
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const isExpanded = selectedOrder === order.id

                  return (
                    <Card key={order.id} className="bg-slate-900 border-slate-800">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <CardTitle className="text-slate-100">{order.title}</CardTitle>
                            <p className="text-sm text-slate-400">Order #{order.orderNumber}</p>
                          </div>
                          <Badge variant="outline" className={getStatusColor(order.status)}>
                            {getStatusDisplay(order.status)}
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
                            <span className="text-slate-300">
                              {order.deadline instanceof Date
                                ? order.deadline.toLocaleDateString()
                                : new Date(order.deadline).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-300">${order.totalAmount}</span>
                          </div>
                          {order.writerId && (
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="h-4 w-4 text-slate-400" />
                              <span className="text-slate-300">Writer Assigned</span>
                            </div>
                          )}
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
                          {order.status === "in_review" && (
                            <Button className="flex-1">Request Revision</Button>
                          )}
                          {order.status === "completed" && (
                            <Button className="flex-1">Download Files</Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
