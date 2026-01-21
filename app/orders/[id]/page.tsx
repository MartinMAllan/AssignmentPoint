"use client"

import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import {
  Calendar,
  Clock,
  FileText,
  DollarSign,
  Download,
  Eye,
  AlertTriangle,
  CheckCircle,
  Loader,
  User,
  Mail,
  Phone,
  BookOpen,
  BarChart3,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { orderService } from "@/lib/api/order.service"
import type { Order } from "@/lib/types"

export default function OrderDetailPage() {
  const params = useParams()
  const { user } = useAuth()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isAdmin = user?.role === "ADMIN"

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)
        const orderId = Array.isArray(params.id) ? params.id[0] : params.id
        const fetchedOrder = await orderService.getOrderById(Number(orderId))
        setOrder(fetchedOrder)
        setError(null)
      } catch (err) {
        console.error("[v0] Error fetching order:", err)
        setError(err instanceof Error ? err.message : "Failed to load order")
        setOrder(null)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchOrder()
    }
  }, [params.id])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <Loader className="h-5 w-5 animate-spin text-blue-500" />
            <p className="text-slate-400">Loading order details...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !order) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-slate-400">{error || "Order not found"}</p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      AVAILABLE: "bg-blue-500",
      BIDDING: "bg-purple-500",
      IN_PROGRESS: "bg-yellow-500",
      SUBMITTED: "bg-cyan-500",
      REVISION: "bg-orange-500",
      COMPLETED: "bg-green-500",
      CANCELLED: "bg-red-500",
    }
    return colors[status] || "bg-slate-500"
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white">{order.title}</h1>
              <Badge className={`${getStatusColor(order.status)} text-white`}>{order.status}</Badge>
            </div>
            <p className="text-slate-400">Order ID: {order.orderNumber}</p>
          </div>
          <Button onClick={() => router.back()} variant="outline">
            Back
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="instructions">Instructions</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
              </TabsList>

              {/* General Tab */}
              <TabsContent value="general" className="space-y-4">
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">Order Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-400 mb-1">Subject</p>
                        <p className="text-white font-medium">{order.subject || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400 mb-1">Academic Level</p>
                        <p className="text-white font-medium">{order.academicLevel || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400 mb-1">Order Type</p>
                        <p className="text-white font-medium">{order.type || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400 mb-1">Language</p>
                        <p className="text-white font-medium">{order.language || "English"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">Specifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-blue-400" />
                        <div>
                          <p className="text-xs text-slate-400">Pages/Slides</p>
                          <p className="text-white font-medium">{order.pages || order.slides || "N/A"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-blue-400" />
                        <div>
                          <p className="text-xs text-slate-400">Words Required</p>
                          <p className="text-white font-medium">{order.words || "N/A"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-400" />
                        <div>
                          <p className="text-xs text-slate-400">Deadline</p>
                          <p className="text-white font-medium">
                            {order.deadline instanceof Date
                              ? format(order.deadline, "MMM dd, yyyy HH:mm a")
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-400" />
                        <div>
                          <p className="text-xs text-slate-400">Budget</p>
                          <p className="text-white font-medium">KES {order.totalAmount || 0}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">Timeline</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <div className="flex-1">
                        <p className="text-xs text-slate-400">Created</p>
                        <p className="text-white">
                          {order.createdAt instanceof Date
                            ? format(order.createdAt, "MMM dd, yyyy HH:mm")
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                    {order.startedAt && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-400" />
                        <div className="flex-1">
                          <p className="text-xs text-slate-400">Started</p>
                          <p className="text-white">
                            {order.startedAt instanceof Date
                              ? format(order.startedAt, "MMM dd, yyyy HH:mm")
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Instructions Tab */}
              <TabsContent value="instructions" className="space-y-4">
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">Order Instructions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96 pr-4">
                      <p className="text-slate-300 whitespace-pre-wrap">{order.description || "No instructions provided."}</p>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Files Tab */}
              <TabsContent value="files" className="space-y-4">
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">Order Files</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {order.files && order.files.length > 0 ? (
                      <ScrollArea className="h-96">
                        <div className="space-y-2 pr-4">
                          {order.files.map((file) => (
                            <div key={file.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700">
                              <div className="flex items-center gap-3 flex-1">
                                <FileText className="h-4 w-4 text-blue-400" />
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-white truncate">{file.filename}</p>
                                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                                    <span>{file.size || "N/A"}</span>
                                    <span>•</span>
                                    <span>
                                      {file.uploadedAt instanceof Date
                                        ? format(file.uploadedAt, "MMM dd, HH:mm a")
                                        : file.uploadedAt
                                          ? format(new Date(file.uploadedAt), "MMM dd, HH:mm a")
                                          : "N/A"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    ) : (
                      <p className="text-slate-400 text-center py-8">No files uploaded</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Info */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white text-base">Customer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-500">
                      {order.customerName?.charAt(0).toUpperCase() || "C"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-white text-sm">{order.customerName || "Unknown"}</p>
                    <p className="text-xs text-slate-400">Customer</p>
                  </div>
                </div>
                {order.customerEmail && (
                  <div className="flex items-start gap-2 text-xs">
                    <Mail className="h-4 w-4 text-slate-500 mt-0.5" />
                    <p className="text-slate-300">{order.customerEmail}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Writer Info */}
            {order.assignedWriter && (
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white text-base">Assigned Writer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-green-500">
                        {order.assignedWriter.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-white text-sm">{order.assignedWriter}</p>
                      <p className="text-xs text-slate-400">Writer</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Key Stats */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white text-base">Order Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Status</p>
                  <Badge className={`${getStatusColor(order.status)} text-white`}>{order.status}</Badge>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Budget</p>
                  <p className="text-lg font-bold text-green-400">KES {order.totalAmount || 0}</p>
                </div>
                {order.isOverdue && (
                  <div className="flex items-center gap-2 p-2 bg-red-500/10 border border-red-500/20 rounded">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    <p className="text-xs text-red-400">Order is overdue</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
