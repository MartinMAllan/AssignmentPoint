import apiClient, { type ApiResponse, handleApiError } from "../api-client"

export interface Message {
  id: number
  orderId: number
  senderId: number
  receiverId: number
  messageText: string
  isRead: boolean
  createdAt: string
}

export interface SendMessageRequest {
  orderId: number
  receiverId: number
  messageText: string
}

export const messageService = {
  async getOrderMessages(orderId: number): Promise<Message[]> {
    try {
      const response = await apiClient.get<ApiResponse<Message[]>>(`messages/order/${orderId}`)
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  async sendMessage(messageData: SendMessageRequest): Promise<Message> {
    try {
      const response = await apiClient.post<ApiResponse<Message>>("messages", messageData)
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  async markAsRead(messageId: number): Promise<void> {
    try {
      await apiClient.patch(`/messages/${messageId}/read`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  async getUserMessages(userId: number): Promise<Message[]> {
    try {
      const response = await apiClient.get<ApiResponse<Message[]>>(`messages/user/${userId}`)
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },
}
