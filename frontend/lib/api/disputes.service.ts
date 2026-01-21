import apiClient from "../api-client"

export interface DisputeStats {
  open: number
  investigating: number
  resolved: number
}

export interface Dispute {
  id: string
  orderId: string
  customer: string
  writer: string
  reason: string
  status: "open" | "investigating" | "resolved"
  createdAt: string
}

export const disputeService = {
  async getDisputeStats(): Promise<DisputeStats> {
    // try {
      const response = await apiClient.get("/disputes/stats")
      return response.data.data || { open: 0, investigating: 0, resolved: 0 }
    // } catch (error) {
    //   console.error("[v0] Failed to fetch dispute stats:", error)
    //   return { open: 0, investigating: 0, resolved: 0 }
    // }
  },

  async getActiveDisputes(): Promise<Dispute[]> {
    // try {
      const response = await apiClient.get("/disputes/active")
      return response.data.data || []
    // } catch (error) {
    //   console.error("[v0] Failed to fetch active disputes:", error)
    //   return []
    // }
  },

  async resolveDispute(disputeId: string): Promise<void> {
    try {
      await apiClient.patch(`/disputes/${disputeId}/resolve`)
    } catch (error) {
      console.error("[v0] Failed to resolve dispute:", error)
      throw error
    }
  },
}
