"use client"

import type React from "react"
import Link from "next/link"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [referralCode, setReferralCode] = useState("")
  const [role, setRole] = useState<string>("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      console.log("[v0] Login page - Starting login for:", email)
      await login(email, password)
      console.log("[v0] Login page - Login successful, redirecting to dashboard")

      router.replace("/dashboard")
    } catch (err) {
      console.error("[v0] Login page - Login error:", err)
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  // Quick login buttons for demo
  const quickLogin = (userEmail: string) => {
    setEmail(userEmail)
    setPassword("password")
    if (userEmail === "customer@example.com") {
      setReferralCode("REF001")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <Card className="w-full max-w-md border-slate-800 bg-slate-900/50 backdrop-blur">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-slate-50">Assignment Point</CardTitle>
          <CardDescription className="text-slate-400">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="bg-red-950/50 border-red-900">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="role" className="text-slate-200">
                Login As
              </Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="writer">Writer</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="admin">Admin (CEO)</SelectItem>
                  <SelectItem value="writer_manager">Writer Manager</SelectItem>
                  <SelectItem value="sales_agent">Sales Agent</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-200">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500"
              />
            </div>

            {/* {role === "customer" && (
              <div className="space-y-2">
                <Label htmlFor="referralCode" className="text-slate-200">
                  Referral Code <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="referralCode"
                  type="text"
                  placeholder="Enter sales rep referral code"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500"
                />
                <p className="text-xs text-slate-400">Required for customer registration</p>
              </div>
            )} */}

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800">
            <p className="text-xs text-slate-400 mb-3 text-center">Quick Login (Demo):</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => quickLogin("writer@example.com")}
                className="text-xs bg-slate-800 border-slate-700 hover:bg-slate-700"
              >
                Writer
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => quickLogin("customer@example.com")}
                className="text-xs bg-slate-800 border-slate-700 hover:bg-slate-700"
              >
                Customer
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => quickLogin("admin@example.com")}
                className="text-xs bg-slate-800 border-slate-700 hover:bg-slate-700"
              >
                Admin
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => quickLogin("sales@example.com")}
                className="text-xs bg-slate-800 border-slate-700 hover:bg-slate-700"
              >
                Sales Agent
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => quickLogin("editor@example.com")}
                className="text-xs bg-slate-800 border-slate-700 hover:bg-slate-700"
              >
                Editor
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => quickLogin("manager@example.com")}
                className="text-xs bg-slate-800 border-slate-700 hover:bg-slate-700"
              >
                Manager
              </Button>
            </div>
          </div>

          <div className="text-center text-sm text-slate-400 mt-4">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium">
              Register here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
