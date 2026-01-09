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
import { Clock, FileText, DollarSign, Upload, MessageSquare, AlertTriangle } from "lucide-react"
import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/lib/auth-context"
import { orderService } from "@/lib/api/order.service"
import { messageService } from "@/lib/api/message.service"
import type { Order, Message } from "@/lib/types"

export default function OrderDetailPage() {
  const params = useParams()
  const { user } = useAuth()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [orderData, messagesData] = await Promise.all([
          orderService.getOrderById(Number(params.id)),
          messageService.getOrderMessages(Number(params.id)), // removed pagination parameter
        ])
        setOrder(orderData)
        setMessages(messagesData) // removed .content property access
      } catch (err) {
        console.error("[v0] Error loading order:", err)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      loadData()
    }
  }, [params.id])

  if (loading || !order) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-slate-400">Loading order...</p>
        </div>
      </DashboardLayout>
    )
  }

  const handleSendMessage = async () => {
    if (newMessage.trim() && user) {
      try {
        await messageService.sendMessage({
          orderId: Number(order.id),
          receiverId: order.customerId === user.id ? Number(order.writerId) : Number(order.customerId),
          messageText: newMessage,
        })
        setNewMessage("")
        // Reload messages
        const messagesData = await messageService.getOrderMessages(Number(params.id))
        setMessages(messagesData)
      } catch (err) {
        console.error("[v0] Error sending message:", err)
      }
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      available: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      in_progress: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      in_review: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
      revision: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      completed: "bg-green-500/10 text-green-500 border-green-500/20",
      canceled: "bg-gray-500/10 text-gray-500 border-gray-500/20",
      disputed: "bg-red-500/10 text-red-500 border-red-500/20",
    }
    return colors[status] || colors.pending
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-slate-100">{order.title}</h1>
              <Badge className={getStatusColor(order.status)}>{order.status.replace("_", " ").toUpperCase()}</Badge>
              {order.isOverdue && (
                <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  1h Overdue
                </Badge>
              )}
            </div>
            <p className="text-slate-400">Order ID: {order.orderNumber}</p>
          </div>
          <div className="flex gap-2">
            {user?.role === "writer" && order.status === "in_progress" && (
              <Button
                onClick={() => router.push(`/orders/${order.id}/submit`)}
                className="bg-green-600 hover:bg-green-700"
              >
                Submit Completed Work
              </Button>
            )}
            <Button variant="outline" className="bg-slate-800 border-slate-700 hover:bg-slate-700">
              Cancel Order
            </Button>
            <Button className="bg-primary hover:bg-primary/90">Request Revision</Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-slate-900 border border-slate-800">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="instructions">Instructions</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4">
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-slate-100">Order Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-400 mb-1">Deadline</p>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-red-400" />
                          <div>
                            <p className="text-slate-200 font-medium">{order.isOverdue ? "1h overdue" : "On time"}</p>
                            <p className="text-xs text-slate-400">
                              Started: {format(order.startedAt || order.createdAt, "MMM dd, HH:mm")}
                            </p>
                            <p className="text-xs text-slate-400">
                              Due date: {format(order.deadline, "MMM dd, HH:mm a")}
                            </p>
                            {order.deliveryTimeHours && (
                              <p className="text-xs text-slate-400">Delivery time: {order.deliveryTimeHours} hours</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-slate-400 mb-1">Order</p>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-500" />
                          <div>
                            <p className="text-slate-200 font-medium">My share</p>
                            <p className="text-2xl font-bold text-green-500">
                              {order.currency || "USD"} {(order.totalAmount * 0.4).toFixed(2)}
                            </p>
                            <p className="text-xs text-slate-400">
                              {order.currency || "USD"} {order.amountPaid || 0} paid
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800">
                      <h3 className="font-semibold text-slate-200 mb-3">Order add-ons</h3>
                      <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="h-5 w-5 text-orange-500" />
                          <div>
                            <p className="text-slate-200 font-medium">Plagiarism & AI report</p>
                            <p className="text-xs text-slate-400">Upload document type: AI report, Plagiarism report</p>
                          </div>
                        </div>
                        <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">To do</Badge>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800">
                      <h3 className="font-semibold text-slate-200 mb-2">Upload files</h3>
                      <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center hover:border-slate-600 transition-colors cursor-pointer">
                        <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-slate-400 text-sm">
                          <span className="text-primary cursor-pointer hover:underline">Browse</span> or drag and drop
                          files here.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="instructions">
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-slate-100">Instructions</CardTitle>
                      <Button variant="ghost" size="icon">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 text-slate-300">
                      <div>
                        <p className="text-sm text-slate-400 mb-1">Topic</p>
                        <p className="font-medium">{order.topic}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400 mb-1">Type</p>
                        <p className="font-medium">{order.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400 mb-1">Education level</p>
                        <p className="font-medium">{order.educationLevel}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400 mb-1">Subject</p>
                        <p className="font-medium">{order.subject}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400 mb-1">Size</p>
                        <p className="font-medium">
                          {order.pagesOrSlides} slides with notes ({order.words.toLocaleString()} words),{" "}
                          {order.spacing}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400 mb-1">Sources</p>
                        <p className="font-medium">{order.sourcesRequired} sources required</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400 mb-1">Citation style</p>
                        <p className="font-medium">{order.citationStyle}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400 mb-1">Service</p>
                        <p className="font-medium">Writing</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400 mb-1">Language</p>
                        <p className="font-medium">{order.language}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400 mb-1">Add-ons</p>
                        <p className="font-medium">Plagiarism & AI report</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400 mb-2">Deadline</p>
                        <p className="font-medium">{format(new Date(order.deadline), "MMM dd, yyyy HH:mm a")}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400 mb-2">Description</p>
                        <div className="p-4 bg-slate-800 rounded-lg">
                          <p className="text-sm leading-relaxed">{order.description}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="files">
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-slate-100">Upload files</CardTitle>
                      <Button variant="outline" size="sm" className="bg-slate-800 border-slate-700">
                        Request to revision
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-400">No files uploaded yet</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Chat Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-900 border-slate-800 h-[calc(100vh-12rem)] flex flex-col">
              <CardHeader className="border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {order.orderNumber.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-slate-100">Order Chat</p>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-400 text-sm">No messages yet</p>
                      <p className="text-slate-500 text-xs mt-1">Start the conversation below</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === Number(user?.id) ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] p-3 rounded-lg ${
                            message.senderId === Number(user?.id)
                              ? "bg-primary text-primary-foreground"
                              : "bg-slate-800 text-slate-200"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.messageText}</p>
                          <div className="flex items-center justify-end gap-1 mt-2">
                            <span className="text-xs opacity-70">{format(new Date(message.createdAt), "HH:mm")}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-slate-800">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="min-h-[80px] bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500"
                  />
                </div>
                <Button onClick={handleSendMessage} className="w-full mt-2 bg-primary hover:bg-primary/90">
                  Send Message
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
