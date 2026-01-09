"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "./types"
import { authService } from "./api/auth.service"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, referralCode?: string) => Promise<void>
  register: (data: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
    role: string
    referralCode?: string
  }) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log("[v0] AuthContext - Initializing auth state")
    const token = authService.getToken()
    const currentUser = authService.getCurrentUser()

    console.log("[v0] AuthContext - Token:", token ? "exists" : "none")
    console.log("[v0] AuthContext - Current user from storage:", currentUser)

    if (token && currentUser) {
      console.log("[v0] AuthContext - Setting user from localStorage:", currentUser)
      setUser(currentUser)
    } else {
      console.log("[v0] AuthContext - No valid session found")
    }

    setIsLoading(false)
    console.log("[v0] AuthContext - Initialization complete")
  }, [])

  const login = async (email: string, password: string, referralCode?: string) => {
    try {
      console.log("[v0] AuthContext - Login started for:", email)
      const response = await authService.login({ email, password, referralCode })
      console.log("[v0] AuthContext - Login response received:", response)

      setUser(response.user)
      console.log("[v0] AuthContext - User state updated to:", response.user)
    } catch (error) {
      console.error("[v0] AuthContext - Login failed:", error)
      throw error
    }
  }

  const register = async (data: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
    role: string
    referralCode?: string
  }) => {
    try {
      console.log("[v0] AuthContext - Registration started for:", data.email)
      const response = await authService.register(data)
      console.log("[v0] AuthContext - Registration response received:", response)

      setUser(response.user)
      console.log("[v0] AuthContext - User state updated to:", response.user)
    } catch (error) {
      console.error("[v0] AuthContext - Registration failed:", error)
      throw error
    }
  }

  const logout = () => {
    console.log("[v0] AuthContext - Logging out")
    authService.logout()
    setUser(null)
  }

  useEffect(() => {
    console.log("[v0] AuthContext - State changed - User:", user?.email || "none", "Loading:", isLoading)
  }, [user, isLoading])

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
