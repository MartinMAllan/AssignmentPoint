"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { AvailableOrderCard } from "@/components/available-order-card"
import { useAuth } from "@/lib/auth-context"
import { orderService } from "@/lib/api/order.service"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Briefcase } from "lucide-react"
import { useState, useMemo, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import type { Order } from "@/lib/types"

export default function AvailableOrdersPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [educationFilter, setEducationFilter] = useState("all")
  const [availableOrders, setAvailableOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return

      try {
        setIsLoading(true)
        const orders = await orderService.getAvailableOrders({
          subject: subjectFilter !== "all" ? subjectFilter : undefined,
          educationLevel: educationFilter !== "all" ? educationFilter : undefined,
        })
        setAvailableOrders(orders)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load available orders",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [user, subjectFilter, educationFilter, toast])

  const subjects = useMemo(() => {
    const uniqueSubjects = Array.from(new Set(availableOrders.map((order) => order.subject)))
    return uniqueSubjects.sort()
  }, [availableOrders])

  const educationLevels = useMemo(() => {
    const uniqueLevels = Array.from(new Set(availableOrders.map((order) => order.educationLevel)))
    return uniqueLevels.sort()
  }, [availableOrders])

  const filteredOrders = useMemo(() => {
    return availableOrders.filter((order) => {
      const matchesSearch =
        order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.subject.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesSearch
    })
  }, [availableOrders, searchQuery])

  const handleBidSubmit = (orderId: string, bidAmount: number, coverLetter: string) => {
    toast({
      title: "Bid Submitted Successfully",
      description: "Your bid has been submitted and is pending review by the customer.",
    })
  }

  if (!user || user.role !== "writer") {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-slate-400">This page is only accessible to writers.</p>
        </div>
      </DashboardLayout>
    )
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-slate-400">Loading available orders...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Available Orders</h1>
          <p className="text-slate-400">Browse and bid on available writing orders</p>
        </div>

        {/* Stats Card */}
        <Card className="bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Available Orders</p>
                <p className="text-3xl font-bold text-slate-100">{availableOrders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-700 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder="Subject" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all">All Subjects</SelectItem>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select value={educationFilter} onValueChange={setEducationFilter}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder="Education Level" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all">All Levels</SelectItem>
                    {educationLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-400">
            Showing {filteredOrders.length} of {availableOrders.length} orders
          </p>
        </div>

        {/* Orders Grid */}
        {filteredOrders.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <AvailableOrderCard key={order.id} order={order} onBidSubmit={handleBidSubmit} />
            ))}
          </div>
        ) : (
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-12 text-center">
              <Briefcase className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-300 mb-2">No Orders Found</h3>
              <p className="text-slate-500">Try adjusting your search or filters to find more orders</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
