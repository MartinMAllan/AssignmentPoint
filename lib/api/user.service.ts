import apiClient, { type ApiResponse, handleApiError } from "../api-client"
import type { User } from "../types"

const USE_MOCK = !process.env.NEXT_PUBLIC_API_URL

export interface UserStats {
  totalOrders: number
  activeOrders: number
  completedOrders: number
  available: number
  inProgress: number
  inReview: number
  revision: number
  disputed: number
  completedPaid: number
  rating?: number
  totalEarnings?: number
}

const generateMockUserStats = (userId: number): UserStats => {
  return {
    totalOrders: Math.floor(Math.random() * 50) + 10,
    activeOrders: Math.floor(Math.random() * 10) + 2,
    completedOrders: Math.floor(Math.random() * 40) + 5,
    available: Math.floor(Math.random() * 15) + 3,
    inProgress: Math.floor(Math.random() * 8) + 1,
    inReview: Math.floor(Math.random() * 5) + 1,
    revision: Math.floor(Math.random() * 3),
    disputed: Math.floor(Math.random() * 2),
    completedPaid: Math.floor(Math.random() * 35) + 5,
    rating: Number.parseFloat((Math.random() * 2 + 3).toFixed(1)),
    totalEarnings: Math.floor(Math.random() * 50000) + 10000,
  }
}

export const userService = {
  async getAllUsers(role?: string): Promise<User[]> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return []
    }

    try {
      const response = await apiClient.get<ApiResponse<User[]>>("api/users", {
        params: { role },
      })
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  async getUserById(userId: number): Promise<User> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300))
      throw new Error("User not found in mock mode")
    }

    try {
      const response = await apiClient.get<ApiResponse<User>>(`api/users/${userId}`)
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  async updateUser(userId: number, updates: Partial<User>): Promise<User> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return { id: userId.toString(), ...updates } as User
    }

    try {
      const response = await apiClient.put<ApiResponse<User>>(`api/users/${userId}`, updates)
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  async getUserStats(userId: number): Promise<UserStats> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300))
      return generateMockUserStats(userId)
    }

    try {
      const response = await apiClient.get<ApiResponse<UserStats>>(`api/users/${userId}/stats`)
      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  async deactivateUser(userId: number): Promise<void> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return
    }

    try {
      await apiClient.patch(`api/users/${userId}/deactivate`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  async activateUser(userId: number): Promise<void> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return
    }

    try {
      await apiClient.patch(`api/users/${userId}/activate`)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },
}
