import apiClient, { type ApiResponse, handleApiError } from "../api-client"

export interface Transaction {
  id: number
  orderId?: number
  userId: number
  transactionType: string
  amount: number
  currency: string
  description: string
  status: string
  createdAt: string
}

export interface EarningsSummary {
  totalEarnings: number
  pendingEarnings: number
  completedEarnings: number
  currency: string
}

export const transactionService = {
  async getUserTransactions(userId: number): Promise<Transaction[]> {
    try {
      const response = await apiClient.get<ApiResponse<Transaction[]>>(`transactions/user/${userId}`)
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  async getEarningsSummary(userId: number): Promise<EarningsSummary> {
    try {
      const response = await apiClient.get<ApiResponse<EarningsSummary>>(`transactions/user/${userId}/summary`)
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  async getOrderTransactions(orderId: number): Promise<Transaction[]> {
    try {
      const response = await apiClient.get<ApiResponse<Transaction[]>>(`transactions/order/${orderId}`)
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },
}
