"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrderCard } from "@/components/order-card"
import { FileText, Clock, Briefcase, AlertCircle, CheckCircle, Users, UserCheck, DollarSign } from "lucide-react"
import type { User, Order } from "@/lib/types"
import { userService } from "@/lib/api/user.service"

interface AdminDashboardProps {
  user: User
  stats: any
  orders: Order[]
}

export default function AdminDashboard({ user, stats, orders }: AdminDashboardProps) {
  const [totalUsers, setTotalUsers] = useState(0)
  const [activeWriters, setActiveWriters] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const allUsers = await userService.getAllUsers()
        setTotalUsers(allUsers.length)

        const writers = allUsers.filter((u) => u.role === "WRITER" && u.isActive)
        setActiveWriters(writers.length)
      } catch (error) {
        console.error("Failed to fetch user statistics:", error)
        // Fallback to showing 0 if fetch fails
        setTotalUsers(0)
        setActiveWriters(0)
      } finally {
        setLoading(false)
      }
    }

    fetchUserStats()
  }, [])

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)
  const activeOrders = orders.filter((o) => ["in_progress", "in_review", "revision"].includes(o.status)).length

  const statCards = [
    {
      title: "Total Orders",
      value: orders.length,
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      link: "/admin/orders",
    },
    {
      title: "Active Orders",
      value: activeOrders,
      icon: Clock,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      link: "/admin/orders?status=active",
    },
    {
      title: "Available Orders",
      value: orders.filter((o) => o.status === "available").length,
      icon: Briefcase,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
      link: "/admin/orders?status=available",
    },
    {
      title: "Completed Orders",
      value: orders.filter((o) => o.status === "completed").length,
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      link: "/admin/orders?status=completed",
    },
    {
      title: "Total Revenue",
      value: `KES ${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      link: "/admin/revenue",
    },
    {
      title: "Disputed Orders",
      value: orders.filter((o) => o.status === "disputed").length,
      icon: AlertCircle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      link: "/admin/orders?status=disputed",
    },
    {
      title: "Total Users",
      value: loading ? "..." : totalUsers,
      icon: Users,
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
      link: "/admin/users",
    },
    {
      title: "Active Writers",
      value: loading ? "..." : activeWriters,
      icon: UserCheck,
      color: "text-violet-500",
      bgColor: "bg-violet-500/10",
      link: "/admin/users?role=writer",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Admin Dashboard</h1>
        <p className="text-slate-400 mt-1">Platform Overview - Manage orders, users, and system performance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
        <h2 className="text-xl font-semibold text-slate-100 mb-4">Recent Platform Activity</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orders.slice(0, 6).map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </div>
    </div>
  )
}
