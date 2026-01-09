"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, UserPlus, TrendingUp, DollarSign, Calendar, Mail, Package } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import type { SalesAgentCustomer } from "@/lib/types"
import { salesAgentService } from "@/lib/api/sales-agent.service"

export default function SalesCustomersPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "new" | "returning">("all")
  const [customers, setCustomers] = useState<SalesAgentCustomer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        if (user?.id) {
          const data = await salesAgentService.getCustomersForSalesAgent(Number(user.id))
          setCustomers(data)
        }
      } catch (error) {
        console.error("Error loading customers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [user?.id])

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: customers.length,
    new: customers.filter((c) => c.status === "new").length,
    returning: customers.filter((c) => c.status === "returning").length,
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">My Customers</h1>
          <p className="text-slate-400 mt-1">Manage your referred customers and track their activity</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Customers</CardTitle>
              <UserPlus className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-100">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">New Customers</CardTitle>
              <UserPlus className="h-4 w-4 text-cyan-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-100">{stats.new}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Returning Customers</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-100">{stats.returning}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-100">${stats.totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search customers by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-900 border-slate-800 text-slate-100 placeholder:text-slate-500"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              onClick={() => setStatusFilter("all")}
              className="border-slate-700"
            >
              All
            </Button>
            <Button
              variant={statusFilter === "new" ? "default" : "outline"}
              onClick={() => setStatusFilter("new")}
              className="border-slate-700"
            >
              New
            </Button>
            <Button
              variant={statusFilter === "returning" ? "default" : "outline"}
              onClick={() => setStatusFilter("returning")}
              className="border-slate-700"
            >
              Returning
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCustomers.map((customer) => (
            <Card key={customer.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg text-slate-100">{customer.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="h-3 w-3 text-slate-500" />
                      <span className="text-sm text-slate-400">{customer.email}</span>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      customer.status === "new"
                        ? "border-cyan-500/50 text-cyan-500"
                        : "border-purple-500/50 text-purple-500"
                    }
                  >
                    {customer.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                      <Package className="h-3 w-3" />
                      Total Orders
                    </div>
                    <div className="text-lg font-semibold text-slate-100">{customer.totalOrders}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                      <DollarSign className="h-3 w-3" />
                      Total Spent
                    </div>
                    <div className="text-lg font-semibold text-slate-100">${customer.totalSpent.toLocaleString()}</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Commission Earned</span>
                    <span className="font-semibold text-green-500">${customer.commissionEarned.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Calendar className="h-3 w-3" />
                  Last order: {customer.lastOrderDate.toLocaleDateString()}
                </div>

                <Link href={`/orders?customer=${customer.id}`}>
                  <Button variant="outline" className="w-full border-slate-700 hover:bg-slate-800 bg-transparent">
                    View Orders
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCustomers.length === 0 && (
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <UserPlus className="h-12 w-12 text-slate-600 mb-4" />
              <h3 className="text-lg font-semibold text-slate-300 mb-2">No customers found</h3>
              <p className="text-slate-500 text-center">
                {searchQuery ? "Try adjusting your search criteria" : "Start referring customers"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
