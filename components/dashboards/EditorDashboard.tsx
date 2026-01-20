"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrderCard } from "@/components/order-card"
import { Edit3, Clock, CheckCircle, AlertCircle, DollarSign } from "lucide-react"
import type { User, Order } from "@/lib/types"

interface EditorDashboardProps {
  user: User
  stats: any
  orders: Order[]
}

export default function EditorDashboard({ user, stats, orders }: EditorDashboardProps) {
  const statCards = [
    {
      title: "Pending Review",
      value: orders.filter((o) => o.status === "in_review").length,
      icon: Edit3,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      link: "/orders?status=in_review",
    },
    {
      title: "In Progress",
      value: stats.inProgress || 0,
      icon: Clock,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      link: "/orders?status=in_progress",
    },
    {
      title: "Completed",
      value: stats.completedPaid || 0,
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      link: "/orders?status=completed",
    },
    {
      title: "Revisions Needed",
      value: stats.revision || 0,
      icon: AlertCircle,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      link: "/orders?status=revision",
    },
    {
      title: "Total Earnings",
      value: `KES ${stats.totalEarnings?.toLocaleString() || 0}`,
      icon: DollarSign,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      link: "/transactions",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Editor Dashboard</h1>
        <p className="text-slate-400 mt-1">Review assignments, manage quality, and track your earnings.</p>
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
        <h2 className="text-xl font-semibold text-slate-100 mb-4">Your Review Queue</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orders.filter((o) => o.status === "in_review").length > 0 ? (
            orders
              .filter((o) => o.status === "in_review")
              .slice(0, 3)
              .map((order) => <OrderCard key={order.id} order={order} />)
          ) : (
            <Card className="col-span-3 bg-slate-900 border-slate-800">
              <CardContent className="pt-6 text-center text-slate-400">
                No assignments in review. Check back soon!
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
