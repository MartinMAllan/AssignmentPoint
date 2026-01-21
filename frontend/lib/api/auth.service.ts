import apiClient, { type ApiResponse, handleApiError } from "../api-client"
import type { User } from "../types"

export interface LoginRequest {
  email: string
  password: string
  referralCode?: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  role: string
  referralCode?: string
}

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      console.log("[v0] Login attempt with email:", credentials.email)
      console.log("[v0] API URL:", process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api")

      const response = await apiClient.post<ApiResponse<LoginResponse>>("auth/login", credentials)

      console.log("[v0] Login response status:", response.status)
      console.log("[v0] Login response data:", response.data)

      if (response.data.success && response.data.data) {
        console.log("[v0] Login successful, storing credentials")
        localStorage.setItem("jwt_token", response.data.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.data.user))
        return response.data.data
      } else {
        throw new Error(response.data.message || "Login failed")
      }
    } catch (error) {
      console.error("[v0] Login failed with error:", error)
      const errorMessage = handleApiError(error)
      console.error("[v0] Extracted error message:", errorMessage)
      throw new Error(errorMessage)
    }
  },

  async register(userData: RegisterRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<ApiResponse<LoginResponse>>("auth/register", userData)

      // Store token and user data
      if (response.data.success) {
        localStorage.setItem("jwt_token", response.data.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.data.user))
      }

      return response.data.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  },

  logout() {
    localStorage.removeItem("jwt_token")
    localStorage.removeItem("user")
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch {
        return null
      }
    }
    return null
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("jwt_token")
  },

  getToken(): string | null {
    return localStorage.getItem("jwt_token")
  },
}
