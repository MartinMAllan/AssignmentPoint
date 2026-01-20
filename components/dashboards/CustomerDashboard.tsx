"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrderCard } from "@/components/order-card"
import { FileText, Briefcase, Clock, CheckCircle, DollarSign, TrendingUp } from "lucide-react"
import type { User, Order } from "@/lib/types"

interface CustomerDashboardProps {
  user: User
  stats: any
  orders: Order[]
}

export default function CustomerDashboard({ user, stats, orders }: CustomerDashboardProps) {
  const customerOrders = orders

  const statCards = [
    {
      title: "Total Orders",
      value: customerOrders.length,
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      link: "/orders",
    },
    {
      title: "In Progress",
      value: customerOrders.filter((o) => ["in_progress", "in_review", "revision"].includes(o.status)).length,
      icon: Clock,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      link: "/orders?status=in_progress",
    },
    {
      title: "Completed",
      value: customerOrders.filter((o) => o.status === "completed").length,
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      link: "/orders?status=completed",
    },
    {
      title: "Available to Assign",
      value: customerOrders.filter((o) => o.status === "available").length,
      icon: Briefcase,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
      link: "/available-orders",
    },
    {
      title: "Total Spent",
      value: `KES ${customerOrders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      link: "/transactions",
    },
    {
      title: "Open Bids",
      value: customerOrders.filter((o) => o.status === "available").reduce((sum, o) => sum + (o.bidCount || 0), 0),
      icon: TrendingUp,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      link: "/orders?tab=bids",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Customer Dashboard</h1>
        <p className="text-slate-400 mt-1">Manage your orders and track assignments from expert writers.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat, index) => (
          <Link key={index} href={stat.link} className="block transition-transform hover:scale-105">
            <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-100">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-semibold text-slate-100 mb-4">Your Recent Orders</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {customerOrders.length > 0 ? (
            customerOrders.slice(0, 3).map((order) => <OrderCard key={order.id} order={order} />)
          ) : (
            <Card className="col-span-3 bg-slate-900 border-slate-800">
              <CardContent className="pt-6 text-center text-slate-400">
                No orders yet. Create a new order to get started!
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
