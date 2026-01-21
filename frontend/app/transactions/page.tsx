"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { transactionService } from "@/lib/api/transaction.service"
import { format } from "date-fns"
import { DollarSign, TrendingUp, TrendingDown, Clock } from "lucide-react"
import type { Transaction } from "@/lib/api/transaction.service"

export default function TransactionsPage() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user?.id) return

      try {
        setLoading(true)
        const data = await transactionService.getUserTransactions(Number(user.id))
        setTransactions(Array.isArray(data) ? data : [])
        setError(null)
      } catch (err) {
        console.error("[v0] Failed to fetch transactions:", err)
        setError("Failed to load transactions")
        setTransactions([])
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [user?.id])

  const getTransactionIcon = (type: string) => {
    if (type.includes("earning") || type.includes("commission")) {
      return <TrendingUp className="h-5 w-5 text-green-500" />
    }
    if (type.includes("withdrawal") || type.includes("penalty")) {
      return <TrendingDown className="h-5 w-5 text-red-500" />
    }
    return <DollarSign className="h-5 w-5 text-blue-500" />
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      completed: "bg-green-500/10 text-green-500 border-green-500/20",
      pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      failed: "bg-red-500/10 text-red-500 border-red-500/20",
      reversed: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    }
    return colors[status] || colors.pending
  }

  const totalEarnings = Array.isArray(transactions)
    ? transactions.filter((t) => t.status === "completed").reduce((sum, t) => sum + t.amount, 0)
    : 0

  const pendingEarnings = Array.isArray(transactions)
    ? transactions.filter((t) => t.status === "pending").reduce((sum, t) => sum + t.amount, 0)
    : 0

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Transactions</h1>
          <p className="text-slate-400 mt-1">Track your earnings and payments</p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <p className="text-2xl font-bold text-slate-100">KES {totalEarnings.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                <p className="text-2xl font-bold text-slate-100">KES {pendingEarnings.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Available Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-blue-500" />
                <p className="text-2xl font-bold text-slate-100">KES {totalEarnings.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transactions List */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-100">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && <p className="text-slate-400">Loading transactions...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && transactions.length === 0 && <p className="text-slate-400">No transactions yet</p>}
            {!loading && transactions.length > 0 && (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-slate-800 rounded-lg hover:bg-slate-750 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-slate-700 rounded-lg">
                        {getTransactionIcon(transaction.transactionType)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-200">{transaction.description}</p>
                        <p className="text-sm text-slate-400">
                          {format(new Date(transaction.createdAt), "MMM dd, yyyy HH:mm")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-lg font-semibold text-slate-100">
                        {transaction.currency} {transaction.amount.toLocaleString()}
                      </p>
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </Badge>
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
