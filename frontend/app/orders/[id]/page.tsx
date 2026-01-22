"use client"

import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { format, isValid } from "date-fns"
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
  MessageSquare,
  Send,
  BarChart3 // Import BarChart3
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
  const [newMessage, setNewMessage] = useState("")
  const [bidAmount, setBidAmount] = useState("")
  const [bidDeliveryHours, setBidDeliveryHours] = useState("")
  const [bidCoverLetter, setBidCoverLetter] = useState("")

  const isAdmin = user?.role === "admin"
  const isCustomer = user?.role === "customer"
  const isWriter = user?.role === "writer"
  const isAvailable = order?.status === "available"

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

  const handleSubmitBid = async () => {
    if (!bidAmount || !bidDeliveryHours) {
      alert("Please fill in all bid details")
      return
    }
    console.log("[v0] Submitting bid:", { bidAmount, bidDeliveryHours, bidCoverLetter })
    // TODO: Implement bid submission
  }

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
      AVAILABLE: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      PENDING: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      BIDDING: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      IN_PROGRESS: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      IN_REVIEW: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      SUBMITTED: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      REVISION: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      COMPLETED: "bg-green-500/20 text-green-400 border-green-500/30",
      CANCELLED: "bg-red-500/20 text-red-400 border-red-500/30",
    }
    return colors[status] || "bg-slate-500/20 text-slate-400 border-slate-500/30"
  }

  // Build tab list based on user role
  const getTabs = () => {
    const baseTabs = ["General", "Instructions", "Files"]
    if (isCustomer || isWriter) {
      baseTabs.push("Messages")
    }
    return baseTabs
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{order.title}</h1>
              <Badge className={`${getStatusColor(order.status)}`}>{order.status}</Badge>
            </div>
            <p className="text-slate-400">Order ID: {order.orderNumber}</p>
          </div>
          {isWriter && isAvailable && (
            <Button onClick={() => document.getElementById("bid-section")?.scrollIntoView()} className="bg-blue-600 hover:bg-blue-700">
              Place Bid
            </Button>
          )}
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="General" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-900 border border-slate-800">
            {getTabs().map((tab) => (
              <TabsTrigger key={tab} value={tab}>
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* General Tab */}
          <TabsContent value="General" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Order Information */}
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle>Order Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-400 mb-1">Subject</p>
                        <p className="font-medium">{order.subject || order.title}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400 mb-1">Education Level</p>
                        <p className="font-medium">{order.educationLevel || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400 mb-1">Order Type</p>
                        <p className="font-medium">{order.type || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400 mb-1">Language</p>
                        <p className="font-medium">{order.language || "English (US)"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Specifications */}
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle>Specifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <FileText className="h-4 w-4 text-slate-400" />
                          <p className="text-sm text-slate-400">Pages / Slides</p>
                        </div>
                        <p className="font-medium text-lg">{order.pagesOrSlides || "Not specified"}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <BarChart3 className="h-4 w-4 text-slate-400" />
                          <p className="text-sm text-slate-400">Words Required</p>
                        </div>
                        <p className="font-medium text-lg">{order.words || "Not specified"}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="h-4 w-4 text-slate-400" />
                          <p className="text-sm text-slate-400">Deadline</p>
                        </div>
                        <p className="font-medium">
                          {(() => {
                            if (!order.deadline) return "Not specified"

                            const date =
                              order.deadline instanceof Date
                                ? order.deadline
                                : new Date(order.deadline)

                            return isValid(date)
                              ? format(date, "MMM dd, yyyy HH:mm a")
                              : "Not specified"
                          })()}
                        </p>
                        
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <DollarSign className="h-4 w-4 text-slate-400" />
                          <p className="text-sm text-slate-400">Budget</p>
                        </div>
                        <p className="font-medium text-lg text-green-400">{order.currency} {order.totalAmount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Timeline */}
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle>Timeline</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <div>
                        <p className="text-sm text-slate-400">Created</p>
                         <p className="font-medium">
                          {(() => {
                            if (!order.createdAt) return "Not specified"

                            const date =
                              order.createdAt instanceof Date
                                ? order.createdAt
                                : new Date(order.createdAt)

                            return isValid(date)
                              ? format(date, "MMM dd, yyyy HH:mm a")
                              : "Not specified"
                          })()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {/* Customer Info */}
                {isAdmin && (
                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                      <CardTitle className="text-lg">Customer</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>C</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">Customer</p>
                          <p className="text-xs text-slate-400">Order Creator</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Order Stats */}
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-lg">Order Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Status</p>
                      <Badge className={`${getStatusColor(order.status)}`}>{order.status}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Budget</p>
                      <p className="font-medium text-lg text-green-400">{order.currency} {order.totalAmount}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Instructions Tab */}
          <TabsContent value="Instructions" className="space-y-4">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle>Order Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 whitespace-pre-wrap">{order.description || "No instructions provided"}</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Files Tab */}
          <TabsContent value="Files" className="space-y-4">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle>Order Files</CardTitle>
              </CardHeader>
              <CardContent>
                {order.files && order.files.length > 0 ? (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3 pr-4">
                      {order.files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-800 rounded border border-slate-700">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-blue-400" />
                            <div>
                              <p className="font-medium">{file.fileName || `File ${index + 1}`}</p>
                              <p className="text-xs text-slate-400">
                                {file.uploadedAt instanceof Date
                                  ? format(file.uploadedAt, "MMM dd, HH:mm a")
                                  : file.uploadedAt
                                    ? format(new Date(file.uploadedAt), "MMM dd, HH:mm a")
                                    : "Date unknown"}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <p className="text-slate-400">No files uploaded for this order</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab (for Customer and Writer) */}
          {(isCustomer || isWriter) && (
            <TabsContent value="Messages" className="space-y-4">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle>Messages</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ScrollArea className="h-[300px] border border-slate-800 rounded p-4">
                    <div className="space-y-3">
                      <p className="text-slate-400 text-center text-sm">No messages yet. Start a conversation!</p>
                    </div>
                  </ScrollArea>

                  <div className="space-y-2">
                    <Textarea
                      placeholder="Type your message here..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                      rows={3}
                    />
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 gap-2">
                      <Send className="h-4 w-4" />
                      Send Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>

        {/* Bid Section for Writers on Available Orders */}
        {isWriter && isAvailable && (
          <Card id="bid-section" className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle>Place Your Bid</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Bid Amount ({order.currency})</label>
                  <input
                    type="number"
                    placeholder="Enter your bid amount"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Delivery Time (hours)</label>
                  <input
                    type="number"
                    placeholder="Enter delivery hours"
                    value={bidDeliveryHours}
                    onChange={(e) => setBidDeliveryHours(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white placeholder:text-slate-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Cover Letter</label>
                <Textarea
                  placeholder="Explain why you're the best fit for this order..."
                  value={bidCoverLetter}
                  onChange={(e) => setBidCoverLetter(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  rows={4}
                />
              </div>
              <Button onClick={handleSubmitBid} className="w-full bg-green-600 hover:bg-green-700">
                Submit Bid
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
