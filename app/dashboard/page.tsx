"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useState, useEffect } from "react"
import type { Order } from "@/lib/types"
import { orderService } from "@/lib/api/order.service"
import { userService } from "@/lib/api/user.service"

import WriterDashboard from "@/components/dashboards/WriterDashboard"
import CustomerDashboard from "@/components/dashboards/CustomerDashboard"
import SalesAgentDashboard from "@/components/dashboards/SalesAgentDashboard"
import AdminDashboard from "@/components/dashboards/AdminDashboard"
import EditorDashboard from "@/components/dashboards/EditorDashboard"
import ManagerDashboard from "@/components/dashboards/ManagerDashboard"

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return

      try {
        setIsLoading(true)
        const statsData = await userService.getUserStats(Number(user.id))
        setStats(statsData)

        let ordersData: Order[] = []
        if (user.role === "writer") {
          ordersData = (await orderService.getOrdersByWriter?.(Number(user.id))) || []
        } else if (user.role === "customer") {
          ordersData = (await orderService.getOrdersByCustomer?.(Number(user.id))) || []
        } else {
          ordersData = await orderService.getAllOrders({ page: 0, size: 6 })
        }

        setRecentOrders(ordersData)
      } catch (error) {
        console.error("[v0] Failed to fetch dashboard data:", error)
        setStats({
          available: 0,
          inProgress: 0,
          inReview: 0,
          revision: 0,
          disputed: 0,
          completedPaid: 0,
          totalEarnings: 0,
        })
        setRecentOrders([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [user])

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-slate-400">Loading...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-slate-400">Redirecting to login...</p>
        </div>
      </DashboardLayout>
    )
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

  const renderDashboard = () => {
    switch (user.role) {
      case "writer":
        return <WriterDashboard user={user} stats={stats} orders={recentOrders} />
      case "customer":
        return <CustomerDashboard user={user} stats={stats} orders={recentOrders} />
      case "sales_agent":
        return <SalesAgentDashboard user={user} stats={stats} orders={recentOrders} />
      case "admin":
        return <AdminDashboard user={user} stats={stats} orders={recentOrders} />
      case "editor":
        return <EditorDashboard user={user} stats={stats} orders={recentOrders} />
      case "writer_manager":
        return <ManagerDashboard user={user} stats={stats} orders={recentOrders} />
      default:
        return <WriterDashboard user={user} stats={stats} orders={recentOrders} />
    }
  }

  return <DashboardLayout>{renderDashboard()}</DashboardLayout>
}
