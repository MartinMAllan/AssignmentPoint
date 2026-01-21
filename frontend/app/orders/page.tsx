"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { OrderCard } from "@/components/order-card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { orderService } from "@/lib/api/order.service"
import type { Order } from "@/lib/types"

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"in_progress" | "in_review" | "revision" | "completed" | "canceled">(
    "in_progress",
  )
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true)
        const customerId = Number(user?.id) || 0
        const data = await orderService.getOrdersByCustomer(customerId)
        setOrders(data)
      } catch (err) {
        console.error("[v0] Error loading orders:", err)
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) {
      loadOrders()
    }
  }, [user?.id])

  const filteredOrders = orders.filter((order) => {
    const matchesTab = order.status === activeTab
    const matchesSearch =
      order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderNumber.includes(searchQuery) ||
      order.subject.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">My Orders</h1>
        </div>

        <div className="border-b border-slate-700">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("in_progress")}
              className={`pb-3 px-1 text-sm font-medium uppercase tracking-wide transition-colors relative ${
                activeTab === "in_progress" ? "text-slate-100" : "text-slate-400 hover:text-slate-300"
              }`}
            >
              In Progress
              {activeTab === "in_progress" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-100" />}
            </button>
            <button
              onClick={() => setActiveTab("in_review")}
              className={`pb-3 px-1 text-sm font-medium uppercase tracking-wide transition-colors relative ${
                activeTab === "in_review" ? "text-slate-100" : "text-slate-400 hover:text-slate-300"
              }`}
            >
              In Review
              {activeTab === "in_review" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-100" />}
            </button>
            <button
              onClick={() => setActiveTab("revision")}
              className={`pb-3 px-1 text-sm font-medium uppercase tracking-wide transition-colors relative ${
                activeTab === "revision" ? "text-slate-100" : "text-slate-400 hover:text-slate-300"
              }`}
            >
              Revision
              {activeTab === "revision" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-100" />}
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`pb-3 px-1 text-sm font-medium uppercase tracking-wide transition-colors relative ${
                activeTab === "completed" ? "text-slate-100" : "text-slate-400 hover:text-slate-300"
              }`}
            >
              Completed
              {activeTab === "completed" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-100" />}
            </button>
            <button
              onClick={() => setActiveTab("canceled")}
              className={`pb-3 px-1 text-sm font-medium uppercase tracking-wide transition-colors relative ${
                activeTab === "canceled" ? "text-slate-100" : "text-slate-400 hover:text-slate-300"
              }`}
            >
              Canceled
              {activeTab === "canceled" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-100" />}
            </button>
          </div>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500"
          />
        </div>

        {/* Orders Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <p className="text-slate-400">Loading orders...</p>
          ) : filteredOrders.length === 0 ? (
            <p className="text-slate-400">No orders found matching your criteria</p>
          ) : (
            filteredOrders.map((order) => <OrderCard key={order.id} order={order} />)
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
