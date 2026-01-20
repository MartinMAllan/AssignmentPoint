import apiClient from "../api-client"

export interface RevenueStats {
  totalRevenue: number
  platformProfit: number
  writerEarnings: number
  agentCommissions: number
}

export interface RevenueTransaction {
  id: string
  orderId: string
  amount: number
  writerShare: number
  agentShare: number
  profit: number
  date: string
}

export const revenueService = {
  async getRevenueStats(): Promise<RevenueStats> {
    // try {
      const response = await apiClient.get("/revenue/stats")
      return (
        response.data.data || {
          totalRevenue: 0,
          platformProfit: 0,
          writerEarnings: 0,
          agentCommissions: 0,
        }
      )
    // } catch (error) {
      // console.error("[v0] Failed to fetch revenue stats:", error)
      // return {
      //   totalRevenue: 0,
      //   platformProfit: 0,
      //   writerEarnings: 0,
      //   agentCommissions: 0,
      // }
    // }
  },

  async getRecentTransactions(limit = 10): Promise<RevenueTransaction[]> {
    try {
      const response = await apiClient.get(`/revenue/transactions?limit=${limit}`)
      return response.data.data || []
    } catch (error) {
      console.error("[v0] Failed to fetch revenue transactions:", error)
      return []
    }
  },
}
