"use client"

import Link from "next/link"

import { useAuth } from "@/lib/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrderCard } from "@/components/order-card"
import { orderService } from "@/lib/api/order.service"
import { userService } from "@/lib/api/user.service"
import { useState, useEffect } from "react"
import type { Order } from "@/lib/types"
import {
  FileText,
  Clock,
  Briefcase,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Users,
  UserCheck,
  UserPlus,
  Building2,
  DollarSign,
  ThumbsDown,
  Edit3,
} from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return

      try {
        setIsLoading(true)
        const [ordersData, statsData] = await Promise.all([
          orderService.getAllOrders({ page: 0, size: 6 }),
          userService.getUserStats(Number(user.id)),
        ])
        setRecentOrders(ordersData)
        setStats(statsData)
      } catch (error) {
        console.error("[v0] Failed to fetch dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [user])

  if (!user) {
    return null
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </DashboardLayout>
    )
  }

  const getAdminStats = () => {
    const totalOrders = recentOrders.length
    const activeOrders = recentOrders.filter((o) => ["in_progress", "in_review", "revision"].includes(o.status)).length
    const availableOrders = recentOrders.filter((o) => o.status === "available").length
    const completedOrders = recentOrders.filter((o) => o.status === "completed").length
    const disputedOrders = recentOrders.filter((o) => o.status === "disputed").length

    const totalUsers = Object.keys(stats).length
    const writers = Object.values(stats).filter((u) => user.role === "writer").length
    const customers = Object.values(stats).filter((u) => user.role === "customer").length
    const salesAgents = Object.values(stats).filter((u) => user.role === "sales_agent").length

    const totalRevenue = recentOrders.reduce((sum, order) => sum + order.totalAmount, 0)
    const pendingBids = 8 // Mock data

    return [
      {
        title: "Total Orders",
        value: totalOrders,
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
        value: availableOrders,
        icon: Briefcase,
        color: "text-cyan-500",
        bgColor: "bg-cyan-500/10",
        link: "/admin/orders?status=available",
      },
      {
        title: "Pending Bids",
        value: pendingBids,
        icon: TrendingUp,
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
        link: "/admin/bids",
      },
      {
        title: "Disputed Orders",
        value: disputedOrders,
        icon: AlertCircle,
        color: "text-red-500",
        bgColor: "bg-red-500/10",
        link: "/admin/orders?status=disputed",
      },
      {
        title: "Completed Orders",
        value: completedOrders,
        icon: CheckCircle,
        color: "text-green-500",
        bgColor: "bg-green-500/10",
        link: "/admin/orders?status=completed",
      },
      {
        title: "Total Users",
        value: totalUsers,
        icon: Users,
        color: "text-indigo-500",
        bgColor: "bg-indigo-500/10",
        link: "/admin/users",
      },
      {
        title: "Writers",
        value: writers,
        icon: UserCheck,
        color: "text-violet-500",
        bgColor: "bg-violet-500/10",
        link: "/admin/users?role=writer",
      },
      {
        title: "Customers",
        value: customers,
        icon: UserPlus,
        color: "text-pink-500",
        bgColor: "bg-pink-500/10",
        link: "/admin/users?role=customer",
      },
      {
        title: "Sales Agents",
        value: salesAgents,
        icon: Building2,
        color: "text-teal-500",
        bgColor: "bg-teal-500/10",
        link: "/admin/users?role=sales_agent",
      },
      {
        title: "Total Revenue",
        value: `$${totalRevenue.toLocaleString()}`,
        icon: DollarSign,
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
        link: "/admin/revenue",
      },
      {
        title: "Disputed Amount",
        value: "$2,450",
        icon: ThumbsDown,
        color: "text-rose-500",
        bgColor: "bg-rose-500/10",
        link: "/admin/orders?status=disputed",
      },
    ]
  }

  const getSalesAgentStats = (agentId: string) => {
    // Mock function to return sales agent stats
    return {
      totalCustomers: 100,
      activeCustomers: 50,
      newCustomers: 20,
      returningCustomers: 30,
      totalOrders: 200,
      totalRevenue: 50000,
      totalCommission: 10000,
      pendingCommission: 5000,
    }
  }

  const getCustomerStats = (customerId: string) => {
    const customerOrders = recentOrders.filter((o) => o.customerId === customerId)
    return [
      {
        title: "Total Orders",
        value: customerOrders.length,
        icon: FileText,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        link: "/orders",
      },
      {
        title: "Available Orders",
        value: customerOrders.filter((o) => o.status === "available").length,
        icon: Briefcase,
        color: "text-cyan-500",
        bgColor: "bg-cyan-500/10",
        link: "/customer/orders?status=available",
      },
      {
        title: "Active Orders",
        value: customerOrders.filter((o) => ["in_progress", "in_review", "revision"].includes(o.status)).length,
        icon: Clock,
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
        link: "/orders",
      },
      {
        title: "Completed Orders",
        value: customerOrders.filter((o) => o.status === "completed").length,
        icon: CheckCircle,
        color: "text-green-500",
        bgColor: "bg-green-500/10",
        link: "/orders?status=completed",
      },
      {
        title: "Total Spent",
        value: `$${customerOrders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}`,
        icon: DollarSign,
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
        link: "/transactions",
      },
      {
        title: "Pending Bids",
        value: "8",
        icon: TrendingUp,
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
        link: "/customer/orders?status=available",
      },
    ]
  }

  const getStatsForRole = () => {
    if (user.role === "admin") {
      return getAdminStats()
    }

    if (user.role === "sales_agent") {
      const agentStats = getSalesAgentStats(user.id)
      return [
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
          title: "New Customers",
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
          title: "Total Orders",
          value: agentStats.totalOrders,
          icon: FileText,
          color: "text-orange-500",
          bgColor: "bg-orange-500/10",
          link: "/orders",
        },
        {
          title: "Total Revenue",
          value: `$${agentStats.totalRevenue.toLocaleString()}`,
          icon: DollarSign,
          color: "text-emerald-500",
          bgColor: "bg-emerald-500/10",
          link: "/orders",
        },
        {
          title: "Total Commission",
          value: `$${agentStats.totalCommission.toLocaleString()}`,
          icon: CheckCircle,
          color: "text-green-500",
          bgColor: "bg-green-500/10",
          link: "/transactions",
        },
        {
          title: "Pending Commission",
          value: `$${agentStats.pendingCommission.toLocaleString()}`,
          icon: Clock,
          color: "text-yellow-500",
          bgColor: "bg-yellow-500/10",
          link: "/transactions?status=pending",
        },
      ]
    }

    if (user.role === "customer") {
      return getCustomerStats(user.id)
    }

    // For writers, editors, and writer_managers, build their respective stats
    const baseStats = [
      {
        title: "Available",
        value: stats.available,
        icon: FileText,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        link: "/available-orders",
      },
      {
        title: "In Progress",
        value: stats.inProgress,
        icon: Clock,
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
        link: "/orders?status=in_progress",
      },
      {
        title: "In Review",
        value: stats.inReview,
        icon: Edit3,
        color: "text-cyan-500",
        bgColor: "bg-cyan-500/10",
        link: "/orders?status=in_review",
      },
      {
        title: "Revision",
        value: stats.revision,
        icon: TrendingUp,
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
        link: "/orders?status=revision",
      },
      {
        title: "Disputed",
        value: stats.disputed,
        icon: ThumbsDown,
        color: "text-red-500",
        bgColor: "bg-red-500/10",
        link: "/orders?status=disputed",
      },
      {
        title: "Completed Paid",
        value: stats.completedPaid,
        icon: CheckCircle,
        color: "text-green-500",
        bgColor: "bg-green-500/10",
        link: "/transactions",
      },
    ]

    // Add earnings for writers and editors
    if (user.role === "writer" || user.role === "editor") {
      baseStats.push({
        title: "Total Earnings",
        value: `KES ${stats.totalEarnings?.toLocaleString() || 0}`,
        icon: DollarSign,
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
        link: "/transactions",
      })
    }

    // Add manager-specific stat
    if (user.role === "writer_manager") {
      baseStats.push({
        title: "Writers Managed",
        value: "12",
        icon: Users,
        color: "text-indigo-500",
        bgColor: "bg-indigo-500/10",
        link: "/orders",
      })
    }

    return baseStats
  }

  const getDashboardTitle = () => {
    const titles: Record<string, string> = {
      writer: "Writer Dashboard",
      admin: "Admin Dashboard",
      writer_manager: "Manager Dashboard",
      customer: "Customer Dashboard",
      sales_agent: "Sales Agent Dashboard",
      editor: "Editor Dashboard",
    }
    return titles[user.role] || "Dashboard"
  }

  const getDashboardSubtitle = () => {
    if (user.role === "admin") {
      return "Platform Overview - Manage orders, users, and monitor system performance"
    }
    return `Welcome back, ${user.firstName}! Here's your activity overview.`
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">{getDashboardTitle()}</h1>
          <p className="text-slate-400 mt-1">{getDashboardSubtitle()}</p>
        </div>

        {/* Stats Grid */}
        <div
          className={
            user.role === "admin"
              ? "grid gap-4 md:grid-cols-2 lg:grid-cols-4"
              : "grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          }
        >
          {getStatsForRole().map((stat, index) => (
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

        {/* Recent Orders */}
        <div>
          <h2 className="text-xl font-semibold text-slate-100 mb-4">
            {user.role === "admin" ? "Recent Platform Activity" : "Recent Orders"}
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentOrders.slice(0, user.role === "admin" ? 6 : 3).map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
