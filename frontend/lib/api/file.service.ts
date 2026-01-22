import apiClient, { type ApiResponse, handleApiError } from "../api-client"
import type { OrderFile } from "../types"

export const fileService = {
  async getOrderFiles(orderId: number): Promise<OrderFile[]> {
    console.log("[v0] fileService.getOrderFiles: Fetching files for orderId:", orderId)

    try {
      const response = await apiClient.get<ApiResponse<OrderFile[]>>(`/files/order/${orderId}`)
      console.log("[v0] fileService.getOrderFiles: Files fetched:", response.data.data.length)
      return response.data.data
    } catch (error) {
      console.error("[v0] fileService.getOrderFiles: Error fetching files:", error)
      // Return empty array instead of throwing to allow page to load without files
      return []
    }
  },
}
