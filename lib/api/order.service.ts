import apiClient, { type ApiResponse, handleApiError } from "../api-client"
import type { Order } from "../types"

export interface CreateOrderRequest {
  title: string
  description: string
  type: string
  educationLevel: string
  subject: string
  pages?: number
  words?: number
  sourcesRequired?: number
  citationStyle?: string
  language?: string
  spacing?: string
  totalAmount: number
  deadline: string
  deliveryTime?: number
}

export interface UpdateOrderRequest {
  status?: string
  writerId?: number
  editorId?: number
}

export interface OrderFilters {
  status?: string
  customerId?: number
  writerId?: number
  subject?: string
  educationLevel?: string
  page?: number
  size?: number
}

export const orderService = {
  async getAllOrders(filters?: OrderFilters): Promise<Order[]> {
    try {
      const response = await apiClient.get<ApiResponse<Order[]>>("api/orders", {
        params: filters,
      })
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  async getOrderById(orderId: number): Promise<Order> {
    try {
      const response = await apiClient.get<ApiResponse<Order>>(`api/orders/${orderId}`)
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    try {
      const response = await apiClient.post<ApiResponse<Order>>("api/orders", orderData)
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  async createOrderWithFiles(formData: FormData): Promise<Order> {
    try {
      const response = await apiClient.post<ApiResponse<Order>>("api/orders/with-files", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  async updateOrder(orderId: number, updates: UpdateOrderRequest): Promise<Order> {
    try {
      const response = await apiClient.put<ApiResponse<Order>>(`api/orders/${orderId}`, updates)
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  async deleteOrder(orderId: number): Promise<void> {
    try {
      await apiClient.delete(`/orders/${orderId}`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  async getOrdersByCustomer(customerId: number): Promise<Order[]> {
    try {
      const response = await apiClient.get<ApiResponse<Order[]>>(`api/orders/customer/${customerId}`)
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  async getOrdersByWriter(writerId: number): Promise<Order[]> {
    try {
      const response = await apiClient.get<ApiResponse<Order[]>>(`api/orders/writer/${writerId}`)
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  async getAvailableOrders(filters?: OrderFilters): Promise<Order[]> {
    try {
      const response = await apiClient.get<ApiResponse<Order[]>>("api/orders/available", {
        params: filters,
      })
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  async updateOrderStatus(orderId: number, status: string): Promise<Order> {
    try {
      const response = await apiClient.patch<ApiResponse<Order>>(`api/orders/${orderId}/status`, { status })
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },
}
