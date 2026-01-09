"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, Users, Percent } from "lucide-react"

export default function RevenuePage() {
  const revenueStats = [
    { label: "Total Revenue", value: "$328,500", icon: DollarSign, color: "text-green-500" },
    { label: "Platform Profit", value: "$131,400", icon: TrendingUp, color: "text-blue-500" },
    { label: "Writer Earnings", value: "$131,400", icon: Users, color: "text-purple-500" },
    { label: "Agent Commissions", value: "$32,850", icon: Percent, color: "text-orange-500" },
  ]

  const recentTransactions = [
    {
      id: "1",
      order: "#10151816",
      amount: 386.8,
      writerShare: 154.72,
      agentShare: 38.68,
      profit: 154.72,
      date: "2025-12-18",
    },
    {
      id: "2",
      order: "#10151815",
      amount: 450.0,
      writerShare: 180.0,
      agentShare: 45.0,
      profit: 180.0,
      date: "2025-12-18",
    },
    {
      id: "3",
      order: "#10151814",
      amount: 320.5,
      writerShare: 128.2,
      agentShare: 32.05,
      profit: 128.2,
      date: "2025-12-17",
    },
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
                <div className="text-2xl font-bold text-slate-100">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-100">Recent Revenue Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <p className="font-medium text-slate-100">{transaction.order}</p>
                    <p className="text-sm text-slate-400">{transaction.date}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-lg font-bold text-slate-100">${transaction.amount}</p>
                    <div className="flex gap-2 text-xs">
                      <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                        Writer: ${transaction.writerShare}
                      </Badge>
                      <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-500/20">
                        Agent: ${transaction.agentShare}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
