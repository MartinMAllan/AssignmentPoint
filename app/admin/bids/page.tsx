"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { bidService, type AdminBidResponse } from "@/lib/api/bid.service"
import { CheckCircle, XCircle, Eye, Search, Star, Clock, FileText, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import Loading from "./loading"

export default function AdminBidsPage() {
  const [bids, setBids] = useState<AdminBidResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("pending")
  const [selectedBid, setSelectedBid] = useState<AdminBidResponse | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const { toast } = useToast()
  const searchParams = useSearchParams()

  useEffect(() => {
    fetchBids()
  }, [statusFilter])

  const fetchBids = async () => {
    try {
      setLoading(true)
      const data = await bidService.getAllBids(statusFilter === "all" ? undefined : statusFilter)
      setBids(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch bids",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptBid = async (bid: AdminBidResponse) => {
    try {
      setActionLoading(bid.id)
      await bidService.acceptBid(bid.id)
      toast({
        title: "Bid Accepted",
        description: `${bid.writerName} has been assigned to order #${bid.orderNumber}`,
      })
      fetchBids()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept bid",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleRejectBid = async () => {
    if (!selectedBid) return
    try {
      setActionLoading(selectedBid.id)
      await bidService.rejectBid(selectedBid.id, rejectReason)
      toast({
        title: "Bid Rejected",
        description: `Bid from ${selectedBid.writerName} has been rejected`,
      })
      setShowRejectDialog(false)
      setRejectReason("")
      setSelectedBid(null)
      fetchBids()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject bid",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      accepted: "bg-green-500/10 text-green-500 border-green-500/20",
      rejected: "bg-red-500/10 text-red-500 border-red-500/20",
      withdrawn: "bg-slate-500/10 text-slate-500 border-slate-500/20",
    }
    return colors[status] || "bg-slate-500/10 text-slate-500 border-slate-500/20"
  }

  const filteredBids = bids.filter((bid) => {
    const matchesSearch =
      bid.orderTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bid.orderNumber.includes(searchQuery) ||
      bid.writerName.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <DashboardLayout>
      <Suspense fallback={<Loading />}>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Bid Management</h1>
            <p className="text-slate-400 mt-1">Review and approve writer bids to assign them to orders</p>
          </div>

          <Tabs value={statusFilter} onValueChange={setStatusFilter}>
            <TabsList className="bg-slate-800 border-slate-700">
              <TabsTrigger value="pending" className="data-[state=active]:bg-slate-700">
                Pending
              </TabsTrigger>
              <TabsTrigger value="accepted" className="data-[state=active]:bg-slate-700">
                Accepted
              </TabsTrigger>
              <TabsTrigger value="rejected" className="data-[state=active]:bg-slate-700">
                Rejected
              </TabsTrigger>
              <TabsTrigger value="all" className="data-[state=active]:bg-slate-700">
                All Bids
              </TabsTrigger>
            </TabsList>

            <TabsContent value={statusFilter} className="mt-4">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-slate-100">
                    {statusFilter === "all" ? "All Bids" : `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Bids`}
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    {statusFilter === "pending"
                      ? "Review these bids and assign writers to orders"
                      : `Viewing ${statusFilter} bids`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search by order, title, or writer name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-slate-800 border-slate-700 text-slate-100"
                    />
                  </div>

                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                    </div>
                  ) : filteredBids.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No bids found</p>
                    </div>
                  ) : (
                    <div className="rounded-md border border-slate-800">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-slate-800 hover:bg-slate-800/50">
                            <TableHead className="text-slate-300">Order</TableHead>
                            <TableHead className="text-slate-300">Writer</TableHead>
                            <TableHead className="text-slate-300">Rating</TableHead>
                            <TableHead className="text-slate-300">Bid Amount</TableHead>
                            <TableHead className="text-slate-300">Delivery</TableHead>
                            <TableHead className="text-slate-300">Submitted</TableHead>
                            <TableHead className="text-slate-300">Status</TableHead>
                            <TableHead className="text-slate-300">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredBids.map((bid) => (
                            <TableRow key={bid.id} className="border-slate-800 hover:bg-slate-800/50">
                              <TableCell>
                                <div>
                                  <p className="font-medium text-slate-300">#{bid.orderNumber}</p>
                                  <p className="text-sm text-slate-500 max-w-[200px] truncate">{bid.orderTitle}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <p className="font-medium text-slate-300">{bid.writerName}</p>
                                  <p className="text-sm text-slate-500">{bid.writerCompletedOrders} orders</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                  <span className="text-slate-300">{bid.writerRating.toFixed(1)}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-slate-300">
                                ${bid.bidAmount.toFixed(2)}
                                <p className="text-xs text-slate-500">Order: ${bid.orderAmount.toFixed(2)}</p>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1 text-slate-400">
                                  <Clock className="h-4 w-4" />
                                  <span>{bid.deliveryHours}h</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-slate-400 text-sm">{formatDate(bid.submittedAt)}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className={getStatusColor(bid.status)}>
                                  {bid.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-slate-400 hover:text-slate-100"
                                    onClick={() => {
                                      setSelectedBid(bid)
                                      setShowDetailsDialog(true)
                                    }}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  {bid.status === "pending" && (
                                    <>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-green-500 hover:text-green-400 hover:bg-green-500/10"
                                        onClick={() => handleAcceptBid(bid)}
                                        disabled={actionLoading === bid.id}
                                      >
                                        {actionLoading === bid.id ? (
                                          <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                          <CheckCircle className="h-4 w-4" />
                                        )}
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                        onClick={() => {
                                          setSelectedBid(bid)
                                          setShowRejectDialog(true)
                                        }}
                                        disabled={actionLoading === bid.id}
                                      >
                                        <XCircle className="h-4 w-4" />
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Bid Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="bg-slate-900 border-slate-800 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-slate-100">Bid Details</DialogTitle>
              <DialogDescription className="text-slate-400">
                Review the full bid details before making a decision
              </DialogDescription>
            </DialogHeader>
            {selectedBid && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-slate-400">Order</p>
                    <p className="font-medium text-slate-200">#{selectedBid.orderNumber}</p>
                    <p className="text-sm text-slate-400">{selectedBid.orderTitle}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-slate-400">Order Amount</p>
                    <p className="font-medium text-slate-200">${selectedBid.orderAmount.toFixed(2)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-slate-400">Writer</p>
                    <p className="font-medium text-slate-200">{selectedBid.writerName}</p>
                    <p className="text-sm text-slate-400">{selectedBid.writerEmail}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-slate-400">Writer Stats</p>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-slate-200">{selectedBid.writerRating.toFixed(1)}</span>
                      <span className="text-slate-500">|</span>
                      <span className="text-slate-400">{selectedBid.writerCompletedOrders} orders</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-slate-400">Bid Amount</p>
                    <p className="font-medium text-green-400">${selectedBid.bidAmount.toFixed(2)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-slate-400">Proposed Delivery</p>
                    <p className="font-medium text-slate-200">{selectedBid.deliveryHours} hours</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-400">Cover Letter</p>
                  <div className="bg-slate-800 rounded-md p-4">
                    <p className="text-slate-300 whitespace-pre-wrap">{selectedBid.coverLetter}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-400">Order Deadline</p>
                  <p className="text-slate-300">{formatDate(selectedBid.orderDeadline)}</p>
                </div>
              </div>
            )}
            <DialogFooter>
              {selectedBid?.status === "pending" && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowDetailsDialog(false)
                      setShowRejectDialog(true)
                    }}
                    className="border-red-500/20 text-red-500 hover:bg-red-500/10"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => {
                      if (selectedBid) {
                        handleAcceptBid(selectedBid)
                        setShowDetailsDialog(false)
                      }
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Accept & Assign Writer
                  </Button>
                </>
              )}
              {selectedBid?.status !== "pending" && (
                <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                  Close
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent className="bg-slate-900 border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-slate-100">Reject Bid</DialogTitle>
              <DialogDescription className="text-slate-400">
                Are you sure you want to reject this bid from {selectedBid?.writerName}?
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Reason (optional)</label>
              <Textarea
                placeholder="Provide a reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="bg-slate-800 border-slate-700 text-slate-100"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleRejectBid}
                disabled={actionLoading === selectedBid?.id}
              >
                {actionLoading === selectedBid?.id ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <XCircle className="h-4 w-4 mr-2" />
                )}
                Reject Bid
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Suspense>
    </DashboardLayout>
  )
}
