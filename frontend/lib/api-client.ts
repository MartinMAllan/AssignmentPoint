import axios, { type AxiosInstance, type AxiosError } from "axios"

// API base URL - can be configured via environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // timeout: 30000,
})

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
  (config) => {
    const isAuthEndpoint = config.url?.includes("/auth/login") || config.url?.includes("/auth/register")

    const token = localStorage.getItem("jwt_token")
    if (token && !isAuthEndpoint) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log("[v0] API Request:", config.method?.toUpperCase(), config.url)
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.log("[v0] API Error Response:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    })

    if (error.response?.status === 401) {
      // Only redirect if not on login/register page to avoid redirect loops
      const isAuthPage = window.location.pathname === "/login" || window.location.pathname === "/register"
      if (!isAuthPage) {
        localStorage.removeItem("jwt_token")
        localStorage.removeItem("user")
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  },
)

// Generic API response type
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

// Error handling helper
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || error.message
    console.log("[v0] Error details:", message, error.response?.status)
    return message
  }
  return "An unexpected error occurred"
}

export default apiClient
