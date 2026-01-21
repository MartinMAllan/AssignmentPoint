"use client"

import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { orderService } from "@/lib/api/order.service"
import { bidService } from "@/lib/api/bid.service"
import { useAuth } from "@/lib/auth-context"
import { format, formatDistanceToNow } from "date-fns"
import {
  Calendar,
  Clock,
  FileText,
  DollarSign,
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  ArrowLeft,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/frontend/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Order, Bid } from "@/lib/types"

export default function OrderBiddingPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  const [proposal, setProposal] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [order, setOrder] = useState<Order | null>(null)
  const [existingBids, setExistingBids] = useState<Bid[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrderData = async () => {
      if (!params.id) return

      try {
        setIsLoading(true)
        const [orderData, bidsData] = await Promise.all([
          orderService.getOrderById(Number(params.id)),
          bidService.getBidsByOrder(Number(params.id)),
        ])
        setOrder(orderData)
        setExistingBids(bidsData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load order details",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrderData()
  }, [params.id, toast])

  if (!user || user.role !== "writer") {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-slate-400">Order not found or access denied</p>
        </div>
      </DashboardLayout>
    )
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-slate-400" />
          <p className="text-slate-400 mt-4">Loading order details...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (!order) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-slate-400">Order not found</p>
        </div>
      </DashboardLayout>
    )
  }

  const writerShare = order.customerIsReturning ? order.totalAmount * 0.45 : order.totalAmount * 0.4
  const writerPercentage = order.customerIsReturning ? 45 : 40

  const hoursUntilDeadline = Math.ceil((new Date(order.deadline).getTime() - Date.now()) / (1000 * 60 * 60))

  const handleSubmitBid = async () => {
    if (!proposal.trim()) {
      toast({
        title: "Missing Proposal",
        description: "Please write a proposal to submit your bid",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await bidService.submitBid({
        orderId: Number(params.id),
        coverLetter: proposal,
      })

      toast({
        title: "Bid Submitted Successfully",
        description: "Your bid has been submitted and is awaiting customer review.",
      })

      router.push("/available-orders")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit bid",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="hover:bg-slate-800">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Place Your Bid</h1>
            <p className="text-slate-400">Review order details and submit your proposal</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - Bidding Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-slate-100 text-xl">{order.title}</CardTitle>
                    <p className="text-slate-400 text-sm mt-1">Order #{order.orderNumber}</p>
                  </div>
                  {order.customerIsReturning && (
                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Returning Client +5%
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-400">Subject</p>
                      <p className="text-sm font-medium text-slate-200">{order.subject}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-400">Level</p>
                      <p className="text-sm font-medium text-slate-200">{order.educationLevel}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-400">Pages</p>
                      <p className="text-sm font-medium text-slate-200">{order.pagesOrSlides}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-400">Deadline</p>
                      <p className="text-sm font-medium text-slate-200">{format(new Date(order.deadline), "MMM dd")}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <p className="text-sm text-slate-400 mb-2">Description</p>
                  <p className="text-sm text-slate-300 leading-relaxed">{order.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <p className="text-xs text-slate-400">Customer's Budget</p>
                    </div>
                    <p className="text-2xl font-bold text-slate-100">
                      {order.currency} {order.totalAmount}
                    </p>
                    <p className="text-sm text-green-500 mt-1">
                      You earn: {order.currency} {writerShare.toFixed(2)} ({writerPercentage}%)
                    </p>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <p className="text-xs text-slate-400">Time to Deadline</p>
                    </div>
                    <p className="text-2xl font-bold text-slate-100">{hoursUntilDeadline}h</p>
                    <p className="text-sm text-slate-400 mt-1">
                      {formatDistanceToNow(new Date(order.deadline), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Alert className="bg-blue-500/10 border-blue-500/20">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-slate-300">
                You will work with the customer's set budget and deadline. Focus on writing a compelling proposal that
                highlights your expertise and approach to this project.
              </AlertDescription>
            </Alert>

            {/* Proposal Form */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-slate-100">Your Proposal</CardTitle>
                <p className="text-sm text-slate-400">Convince the customer why you're the best fit for this project</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="proposal" className="text-slate-200">
                    Proposal *
                  </Label>
                  <Textarea
                    id="proposal"
                    placeholder="Write your proposal here... 

Tips:
• Introduce yourself and highlight relevant experience
• Explain your approach to this specific project
• Mention similar work you've completed
• Emphasize your commitment to quality and deadlines
• Keep it professional and concise"
                    value={proposal}
                    onChange={(e) => setProposal(e.target.value)}
                    className="min-h-[300px] bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500"
                  />
                  <p className="text-xs text-slate-400">
                    {proposal.length} / 2000 characters{" "}
                    {proposal.length < 100 && "(Minimum 100 characters recommended)"}
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSubmitBid}
                    disabled={isSubmitting || proposal.length < 50}
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Bid"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.back()}
                    className="border-slate-700 hover:bg-slate-800"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            {/* Competition */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-slate-100 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Competition
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-3xl font-bold text-slate-100">{existingBids.length}</p>
                  <p className="text-sm text-slate-400">Writers have bid on this order</p>
                </div>

                {existingBids.length > 0 && (
                  <>
                    <div className="pt-4 border-t border-slate-800 space-y-3">
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Average Rating</p>
                        <p className="text-lg font-bold text-yellow-500">
                          {(existingBids.reduce((sum, bid) => sum + bid.writerRating, 0) / existingBids.length).toFixed(
                            1,
                          )}{" "}
                          ★
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Most Experienced</p>
                        <p className="text-lg font-bold text-slate-200">
                          {Math.max(...existingBids.map((b) => b.completedOrders))} orders
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Earnings Info */}
            <Card className="bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
              <CardContent className="p-6">
                <DollarSign className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold text-slate-100 mb-2">Your Earnings</h3>
                <p className="text-sm text-slate-400 mb-4">
                  You earn {writerPercentage}% of the order value
                  {order.customerIsReturning && " (Returning customer bonus)"}
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Order Budget:</span>
                    <span className="text-slate-200 font-medium">
                      {order.currency} {order.totalAmount}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Your Share ({writerPercentage}%):</span>
                    <span className="text-green-500 font-bold">
                      {order.currency} {writerShare.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Requirements */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-slate-100 text-sm">Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Type:</span>
                  <span className="text-slate-200">{order.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Words:</span>
                  <span className="text-slate-200">{order.words?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Sources:</span>
                  <span className="text-slate-200">{order.sourcesRequired}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Citation:</span>
                  <span className="text-slate-200">{order.citationStyle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Spacing:</span>
                  <span className="text-slate-200">{order.spacing}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
