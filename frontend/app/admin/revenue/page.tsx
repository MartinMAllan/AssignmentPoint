"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, Users, Percent } from "lucide-react"
import { revenueService, type RevenueStats, type RevenueTransaction } from "@/lib/api/revenue.service"

export default function RevenuePage() {
  const [stats, setStats] = useState<RevenueStats | null>(null)
  const [transactions, setTransactions] = useState<RevenueTransaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const [statsData, transactionsData] = await Promise.all([
        revenueService.getRevenueStats(),
        revenueService.getRecentTransactions(),
      ])
      setStats(statsData)
      setTransactions(transactionsData)
      setLoading(false)
    }
    fetchData()
  }, [])

  const revenueStats = [
    { label: "Total Revenue", value: stats?.totalRevenue ?? 0, icon: DollarSign, color: "text-green-500" },
    { label: "Platform Profit", value: stats?.platformProfit ?? 0, icon: TrendingUp, color: "text-blue-500" },
    { label: "Writer Earnings", value: stats?.writerEarnings ?? 0, icon: Users, color: "text-purple-500" },
    { label: "Agent Commissions", value: stats?.agentCommissions ?? 0, icon: Percent, color: "text-orange-500" },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Revenue Management</h1>
          <p className="text-slate-400 mt-1">Platform revenue and distribution overview</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {revenueStats.map((stat) => (
            <Card key={stat.label} className="bg-slate-900 border-slate-800">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">{stat.label}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-100">
                  ${typeof stat.value === "number" ? stat.value.toLocaleString() : 0}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-100">Recent Revenue Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-slate-400">Loading transactions...</p>
            ) : transactions.length === 0 ? (
              <p className="text-slate-400">No transactions yet</p>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between border-b border-slate-800 pb-4"
                  >
                    <div>
                      <p className="font-medium text-slate-100">{transaction.orderId}</p>
                      <p className="text-sm text-slate-400">{transaction.date}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-lg font-bold text-slate-100">${transaction.amount.toFixed(2)}</p>
                      <div className="flex gap-2 text-xs">
                        <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                          Writer: ${transaction.writerShare.toFixed(2)}
                        </Badge>
                        <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-500/20">
                          Agent: ${transaction.agentShare.toFixed(2)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
