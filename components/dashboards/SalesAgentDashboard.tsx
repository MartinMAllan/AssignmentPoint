"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, UserPlus, TrendingUp, DollarSign, Clock } from "lucide-react"
import type { User, Order } from "@/lib/types"

interface SalesAgentDashboardProps {
  user: User
  stats: any
  orders: Order[]
}

export default function SalesAgentDashboard({ user, stats, orders }: SalesAgentDashboardProps) {
  const agentStats = {
    totalCustomers: 45,
    activeCustomers: 32,
    newCustomers: 8,
    returningCustomers: 37,
    totalOrders: 156,
    totalRevenue: 78000,
    totalCommission: 12480,
    pendingCommission: 3120,
  }

  const statCards = [
    {
      title: "Total Customers",
      value: agentStats.totalCustomers,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      link: "/sales/customers",
    },
    {
      title: "Active Customers",
      value: agentStats.activeCustomers,
      icon: UserCheck,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      link: "/sales/customers?status=active",
    },
    {
      title: "New This Month",
      value: agentStats.newCustomers,
      icon: UserPlus,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
      link: "/sales/customers?status=new",
    },
    {
      title: "Returning Customers",
      value: agentStats.returningCustomers,
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      link: "/sales/customers?status=returning",
    },
    {
      title: "Total Commission",
      value: `KES ${agentStats.totalCommission.toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      link: "/transactions?type=commission",
    },
    {
      title: "Pending Commission",
      value: `KES ${agentStats.pendingCommission.toLocaleString()}`,
      icon: Clock,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      link: "/transactions?status=pending",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Sales Dashboard</h1>
        <p className="text-slate-400 mt-1">Track your referrals, customer growth, and commission earnings.</p>
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
          <CardTitle>Your Referral Code</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <code className="flex-1 bg-slate-800 px-4 py-2 rounded text-emerald-400 font-mono">{`REF${user.id}SALES`}</code>
            <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded text-white transition">
              Copy
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
