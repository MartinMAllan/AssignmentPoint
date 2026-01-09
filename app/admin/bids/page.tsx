"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, XCircle, Eye } from "lucide-react"
import { useState, useEffect } from "react"
import { bidService } from "@/lib/api/bid.service"
import { orderService } from "@/lib/api/order.service"
import type { Bid, Order } from "@/lib/types"

export default function AdminBidsPage() {
  const [bids, setBids] = useState<Bid[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [bidsData, ordersData] = await Promise.all([bidService.getPendingBids(), orderService.getAllOrders()])
        setBids(bidsData)
        setOrders(ordersData)
      } catch (err) {
        console.error("[v0] Error loading bids:", err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const getOrderTitle = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId)
    return order?.title || "Unknown Order"
  }

  const getWriterName = (writerId: string) => {
    return `Writer #${writerId}`
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Bid Management</h1>
          <p className="text-slate-400 mt-1">Review and approve writer bids for available orders</p>
        </div>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-100">Pending Bids</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-slate-800">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800 hover:bg-slate-800/50">
                    <TableHead className="text-slate-300">Order</TableHead>
                    <TableHead className="text-slate-300">Writer</TableHead>
                    <TableHead className="text-slate-300">Bid Amount</TableHead>
                    <TableHead className="text-slate-300">Writer Share</TableHead>
                    <TableHead className="text-slate-300">Submitted</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-slate-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-slate-400">
                        Loading bids...
                      </TableCell>
                    </TableRow>
                  ) : bids.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-slate-400">
                        No pending bids
                      </TableCell>
                    </TableRow>
                  ) : (
                    bids.map((bid) => (
                      <TableRow key={bid.id} className="border-slate-800 hover:bg-slate-800/50">
                        <TableCell className="font-medium text-slate-300 max-w-[200px] truncate">
                          {getOrderTitle(bid.orderId)}
                        </TableCell>
                        <TableCell className="text-slate-400">{getWriterName(bid.writerId)}</TableCell>
                        <TableCell className="text-slate-300">${bid.bidAmount.toFixed(2)}</TableCell>
                        <TableCell className="text-green-400">${(bid.bidAmount * 0.4).toFixed(2)}</TableCell>
                        <TableCell className="text-slate-400">{new Date(bid.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                            Pending
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost" className="text-slate-400 hover:text-slate-100">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-green-500 hover:text-green-400">
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-400">
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
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
