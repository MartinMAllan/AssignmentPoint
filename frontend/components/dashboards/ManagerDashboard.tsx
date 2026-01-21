"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, TrendingUp, CheckCircle, Clock, DollarSign } from "lucide-react"
import type { User, Order } from "@/lib/types"

interface ManagerDashboardProps {
  user: User
  stats: any
  orders: Order[]
}

export default function ManagerDashboard({ user, stats, orders }: ManagerDashboardProps) {
  const managerStats = {
    totalWriters: 12,
    activeWriters: 9,
    totalOrdersManaged: 245,
    activeOrders: 34,
    completedOrders: 198,
    totalEarnings: 156000,
  }

  const statCards = [
    {
      title: "Writers Managed",
      value: managerStats.totalWriters,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      link: "/manager/writers",
    },
    {
      title: "Active Writers",
      value: managerStats.activeWriters,
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      link: "/manager/writers?status=active",
    },
    {
      title: "Orders in Progress",
      value: managerStats.activeOrders,
      icon: Clock,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      link: "/orders?status=in_progress",
    },
    {
      title: "Completed Orders",
      value: managerStats.completedOrders,
      icon: CheckCircle,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      link: "/orders?status=completed",
    },
    {
      title: "Team Earnings",
      value: `KES ${managerStats.totalEarnings.toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-600/10",
      link: "/transactions",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Manager Dashboard</h1>
        <p className="text-slate-400 mt-1">Manage your team of writers and monitor team performance.</p>
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

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle>Team Performance Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Average Writer Rating</span>
            <span className="text-2xl font-bold text-slate-100">4.8/5.0</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">On-time Delivery Rate</span>
            <span className="text-2xl font-bold text-emerald-400">94%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Customer Satisfaction</span>
            <span className="text-2xl font-bold text-emerald-400">96%</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
