"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, Users, FileText, DollarSign, Activity } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { useState, useEffect } from "react"
import { analyticsService } from "@/lib/api/analytics.service"
import type {
  AnalyticsMetrics,
  RevenueChartData,
  OrderStatusData,
  UserGrowthData,
  TopWriterData,
  CustomerAcquisitionData,
} from "@/lib/api/analytics.service"


export default function AnalyticsPage() {
const [timeRange, setTimeRange] = useState<string>("30days")
const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null)
const [revenueData, setRevenueData] = useState<RevenueChartData[]>([])
const [orderStatusData, setOrderStatusData] = useState<OrderStatusData[]>([])
const [userGrowth, setUserGrowth] = useState<UserGrowthData | null>(null)
const [topWriters, setTopWriters] = useState<TopWriterData[]>([])
const [customerData, setCustomerData] = useState<CustomerAcquisitionData[]>([])
const [loading, setLoading] = useState<boolean>(true)


  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true)
      try {
        const [metricsRes, revenueRes, orderRes, usersRes, writersRes, customerRes] = await Promise.all([
          analyticsService.getAnalyticsMetrics(timeRange),
          analyticsService.getRevenueChart(timeRange),
          analyticsService.getOrderStatusDistribution(),
          analyticsService.getUserGrowth(timeRange),
          analyticsService.getTopWriters(),
          analyticsService.getCustomerAcquisition(timeRange),
        ])

        setMetrics(metricsRes)
        setRevenueData(revenueRes)
        setOrderStatusData(orderRes)
        setUserGrowth(usersRes)
        setTopWriters(writersRes)
        setCustomerData(customerRes)
      } catch (error) {
        console.error("[v0] Failed to fetch analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [timeRange])

  const stats = metrics
    ? [
        {
          title: "Total Revenue",
          value: `$${metrics.totalRevenue?.toLocaleString() || 0}`,
          change: "+12.5%",
          trend: "up",
          icon: DollarSign,
        },
        {
          title: "Total Orders",
          value: metrics.totalOrders?.toString() || "0",
          change: "+8.2%",
          trend: "up",
          icon: FileText,
        },
        {
          title: "Active Users",
          value: metrics.activeUsers?.toLocaleString() || "0",
          change: "+18.7%",
          trend: "up",
          icon: Users,
        },
        {
          title: "Avg Order Value",
          value: `$${metrics.avgOrderValue || 0}`,
          change: "-2.3%",
          trend: "down",
          icon: Activity,
        },
      ]
    : []

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Analytics Dashboard</h1>
            <p className="text-slate-400 mt-1">Platform performance metrics and insights</p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40 bg-slate-800 border-slate-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            <div className="col-span-full text-center text-slate-400">Loading metrics...</div>
          ) : (
            stats.map((stat) => (
              <Card key={stat.title} className="bg-slate-900 border-slate-800">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">{stat.title}</CardTitle>
                  <stat.icon className="h-4 w-4 text-slate-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-100">{stat.value}</div>
                  <div className="flex items-center gap-1 text-sm mt-1">
                    {stat.trend === "up" ? (
                      <>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-green-500">{stat.change}</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="h-4 w-4 text-red-500" />
                        <span className="text-red-500">{stat.change}</span>
                      </>
                    )}
                    <span className="text-slate-500">vs last period</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Charts */}
        <Tabs defaultValue="revenue" className="space-y-4">
          <TabsList className="bg-slate-900 border border-slate-800">
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="space-y-4">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-slate-100">Revenue Overview</CardTitle>
                <CardDescription className="text-slate-400">Monthly revenue and order trends</CardDescription>
              </CardHeader>
              <CardContent>
                {revenueData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="month" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid #334155",
                          borderRadius: "0.5rem",
                          color: "#f1f5f9",
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
                      <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-slate-400 py-8">No revenue data available</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-slate-100">Order Status Distribution</CardTitle>
                  <CardDescription className="text-slate-400">Current order statuses</CardDescription>
                </CardHeader>
                <CardContent>
                  {orderStatusData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={orderStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {orderStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1e293b",
                            border: "1px solid #334155",
                            borderRadius: "0.5rem",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center text-slate-400 py-8">No order data available</div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-slate-100">Customer Acquisition</CardTitle>
                  <CardDescription className="text-slate-400">New vs returning customers</CardDescription>
                </CardHeader>
                <CardContent>
                  {customerData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={customerData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="week" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1e293b",
                            border: "1px solid #334155",
                            borderRadius: "0.5rem",
                          }}
                        />
                        <Legend />
                        <Bar dataKey="new" fill="#3b82f6" />
                        <Bar dataKey="returning" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center text-slate-400 py-8">No customer data available</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-slate-100">User Growth</CardTitle>
                <CardDescription className="text-slate-400">Platform user statistics</CardDescription>
              </CardHeader>
              <CardContent>
                {userGrowth ? (
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <p className="text-sm text-slate-400">Total Writers</p>
                        <p className="text-2xl font-bold text-slate-100">{userGrowth.totalWriters}</p>
                        <p className="text-sm text-green-500">+12 this month</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-slate-400">Total Customers</p>
                        <p className="text-2xl font-bold text-slate-100">{userGrowth.totalCustomers}</p>
                        <p className="text-sm text-green-500">+45 this month</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-slate-400">Sales Agents</p>
                        <p className="text-2xl font-bold text-slate-100">{userGrowth.salesAgents}</p>
                        <p className="text-sm text-green-500">+2 this month</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-slate-400 py-8">No user data available</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-slate-100">Top Writer Performance</CardTitle>
                <CardDescription className="text-slate-400">Most productive writers</CardDescription>
              </CardHeader>
              <CardContent>
                {topWriters.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={topWriters} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis type="number" stroke="#94a3b8" />
                      <YAxis dataKey="name" type="category" stroke="#94a3b8" width={120} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid #334155",
                          borderRadius: "0.5rem",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="completed" fill="#3b82f6" name="Completed Orders" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-slate-400 py-8">No writer data available</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
