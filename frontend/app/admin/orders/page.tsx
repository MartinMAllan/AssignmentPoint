"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreVertical, Eye, UserCheck, XCircle, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { orderService } from "@/lib/api/order.service"
import type { Order } from "@/lib/types"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true)
        const data = await orderService.getAllOrders()
        setOrders(data)
      } catch (err) {
        console.error("[v0] Error loading orders:", err)
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [])

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      available: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      in_progress: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      in_review: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
      revision: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      completed: "bg-green-500/10 text-green-500 border-green-500/20",
      canceled: "bg-slate-500/10 text-slate-500 border-slate-500/20",
      disputed: "bg-red-500/10 text-red-500 border-red-500/20",
    }
    return colors[status] || "bg-slate-500/10 text-slate-500"
  }

  const getUserName = (userId: string | undefined) => {
    if (!userId) return "Unassigned"
    return `User #${userId}`
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.title.toLowerCase().includes(searchQuery.toLowerCase()) || order.orderNumber.includes(searchQuery)
    const matchesStatus = !statusFilter || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Order Management</h1>
          <p className="text-slate-400 mt-1">View and manage all platform orders</p>
        </div>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-100">All Orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search by order number or title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-700 text-slate-100"
                  />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={statusFilter === null ? "default" : "outline"}
                  onClick={() => setStatusFilter(null)}
                  size="sm"
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === "available" ? "default" : "outline"}
                  onClick={() => setStatusFilter("available")}
                  size="sm"
                >
                  Available
                </Button>
                <Button
                  variant={statusFilter === "in_progress" ? "default" : "outline"}
                  onClick={() => setStatusFilter("in_progress")}
                  size="sm"
                >
                  In Progress
                </Button>
                <Button
                  variant={statusFilter === "disputed" ? "default" : "outline"}
                  onClick={() => setStatusFilter("disputed")}
                  size="sm"
                >
                  Disputed
                </Button>
              </div>
            </div>

            <div className="rounded-md border border-slate-800">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800 hover:bg-slate-800/50">
                    <TableHead className="text-slate-300">Order #</TableHead>
                    <TableHead className="text-slate-300">Title</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-slate-300">Amount</TableHead>
                    <TableHead className="text-slate-300">Deadline</TableHead>
                    <TableHead className="text-slate-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-slate-400">
                        Loading orders...
                      </TableCell>
                    </TableRow>
                  ) : filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-slate-400">
                        No orders found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id} className="border-slate-800 hover:bg-slate-800/50">
                        <TableCell className="font-medium text-slate-300">{order.orderNumber}</TableCell>
                        <TableCell className="text-slate-300 max-w-[200px] truncate">{order.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(order.status)}>
                            {order.status.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {order.currency} {order.totalAmount.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-slate-400">
                          {new Date(order.deadline).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                              <DropdownMenuItem className="text-slate-300 focus:bg-slate-700">
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              {order.status === "available" && (
                                <DropdownMenuItem className="text-slate-300 focus:bg-slate-700">
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Assign Writer
                                </DropdownMenuItem>
                              )}
                              {order.status === "disputed" && (
                                <DropdownMenuItem className="text-slate-300 focus:bg-slate-700">
                                  <AlertCircle className="mr-2 h-4 w-4" />
                                  Resolve Dispute
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="text-red-400 focus:bg-slate-700">
                                <XCircle className="mr-2 h-4 w-4" />
                                Cancel Order
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
