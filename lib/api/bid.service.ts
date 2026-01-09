import apiClient, { type ApiResponse, handleApiError } from "../api-client"
import type { Bid } from "../types"

export interface CreateBidRequest {
  orderId: number
  coverLetter: string
}

export interface BidResponse extends Bid {
  writerName: string
  writerRating: number
}

export const bidService = {
  async submitBid(bidData: CreateBidRequest): Promise<Bid> {
    try {
      const response = await apiClient.post<ApiResponse<Bid>>("api/bids", bidData)
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  async getBidsByOrder(orderId: number): Promise<BidResponse[]> {
    try {
      const response = await apiClient.get<ApiResponse<BidResponse[]>>(`api/bids/order/${orderId}`)
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  async getBidsByWriter(writerId: number): Promise<Bid[]> {
    try {
      const response = await apiClient.get<ApiResponse<Bid[]>>(`api/bids/writer/${writerId}`)
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  async getPendingBids(): Promise<Bid[]> {
    try {
      const response = await apiClient.get<ApiResponse<Bid[]>>("api/bids/pending")
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  async getAllBids(): Promise<Bid[]> {
    try {
      const response = await apiClient.get<ApiResponse<Bid[]>>("api/bids")
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  async acceptBid(bidId: number): Promise<Bid> {
    try {
      const response = await apiClient.post<ApiResponse<Bid>>(`api/bids/${bidId}/accept`)
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  async rejectBid(bidId: number, reason?: string): Promise<void> {
    try {
      await apiClient.post(`/bids/${bidId}/reject`, { reason })
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  async withdrawBid(bidId: number): Promise<void> {
    try {
      await apiClient.post(`/bids/${bidId}/withdraw`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },
}
