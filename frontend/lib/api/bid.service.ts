import apiClient, { type ApiResponse, handleApiError} from "../api-client"
import type { Bid } from "../types"
import { mockBids, mockOrderBids, mockOrders } from "../mock-data"

export interface CreateBidRequest {
  writerId: number
  orderId: number
  coverLetter: string
}

export interface BidResponse extends Bid {
  writerName: string
  writerRating: number
}

export interface AdminBidResponse {
  id: number
  orderId: number
  orderNumber: string
  orderTitle: string
  orderAmount: number
  orderDeadline: string
  writerId: number
  writerName: string
  writerEmail: string
  writerRating: number
  writerCompletedOrders: number
  bidAmount: number
  currency: string
  deliveryHours: number
  coverLetter: string
  status: string
  submittedAt: string
}

export const bidService = {
  async submitBid(bidData: CreateBidRequest): Promise<Bid> {
    
    try {
      const response = await apiClient.post<ApiResponse<Bid>>("/bids", bidData)
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  async getBidsByOrder(orderId: number): Promise<BidResponse[]> {
  

    try {
      const response = await apiClient.get<ApiResponse<BidResponse[]>>(`/bids/order/${orderId}`)
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  async getBidsByWriter(writerId: number): Promise<Bid[]> {
    
    try {
      const response = await apiClient.get<ApiResponse<Bid[]>>(`/bids/writer/${writerId}`)
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  async getAllPendingBids(): Promise<AdminBidResponse[]> {

    try {
      const response = await apiClient.get<ApiResponse<AdminBidResponse[]>>("/bids/admin/pending")
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  async getAllBids(status?: string): Promise<AdminBidResponse[]> {

    try {
      const params = status ? `?status=${status}` : ""
      const response = await apiClient.get<ApiResponse<AdminBidResponse[]>>(`/bids/admin/all${params}`)
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  async acceptBid(bidId: number): Promise<Bid> {
  
    try {
      const response = await apiClient.post<ApiResponse<Bid>>(`/bids/${bidId}/accept`)
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
