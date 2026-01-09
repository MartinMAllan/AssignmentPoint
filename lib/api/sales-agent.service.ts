import apiClient from "../api-client"
import type { SalesAgentCustomer } from "@/lib/types"

export const salesAgentService = {
  async getCustomersForSalesAgent(salesAgentId: number): Promise<SalesAgentCustomer[]> {
    try {
      const response = await apiClient.get(`api/sales-agents/${salesAgentId}/customers`)
      return response.data || []
    } catch (error) {
      console.error("[v0] Error fetching customers for sales agent:", error)
      throw error
    }
  },
}
