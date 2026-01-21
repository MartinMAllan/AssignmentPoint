"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, ArrowLeft } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    role: "",
    referralCode: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!formData.role) {
      setError("Please select a role")
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.role === "CUSTOMER" && !formData.referralCode) {
      setError("Referral code is required for customer registration")
      return
    }

    setIsLoading(true)

    try {
      console.log("[v0] Register page - Starting registration for:", formData.email)
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || undefined,
        role: formData.role,
        referralCode: formData.referralCode || undefined,
      })
      console.log("[v0] Register page - Registration successful, redirecting to dashboard")

      router.replace("/dashboard")
    } catch (err) {
      console.error("[v0] Register page - Registration error:", err)
      setError(err instanceof Error ? err.message : "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <Card className="w-full max-w-2xl border-slate-800 bg-slate-900/50 backdrop-blur">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-200">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <CardTitle className="text-2xl font-bold text-slate-50">Create Account</CardTitle>
              <CardDescription className="text-slate-400">Join Assignment Point today</CardDescription>
            </div>
          </div>
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
                I want to register as <span className="text-red-400">*</span>
              </Label>
              <Select value={formData.role} onValueChange={(value) => handleChange("role", value)}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="WRITER">Writer - Complete academic assignments</SelectItem>
                  <SelectItem value="CUSTOMER">Customer - Order academic writing services</SelectItem>
                  <SelectItem value="SALES_AGENT">Sales Agent - Refer customers and earn commissions</SelectItem>
                  <SelectItem value="EDITOR">Editor - Review and polish completed work</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-slate-200">
                  First Name <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  required
                  className="bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-slate-200">
                  Last Name <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  required
                  className="bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">
                Email <span className="text-red-400">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
                className="bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-slate-200">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-200">
                  Password <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Min. 8 characters"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  required
                  className="bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-200">
                  Confirm Password <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  required
                  className="bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500"
                />
              </div>
            </div>

            {formData.role === "CUSTOMER" && (
              <div className="space-y-2">
                <Label htmlFor="referralCode" className="text-slate-200">
                  Referral Code <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="referralCode"
                  type="text"
                  placeholder="Enter sales agent referral code"
                  value={formData.referralCode}
                  onChange={(e) => handleChange("referralCode", e.target.value)}
                  className="bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500"
                />
                <p className="text-xs text-slate-400">
                  Required for customer registration. Don't have one? Contact our sales team.
                </p>
              </div>
            )}

            {formData.role === "SALES_AGENT" && (
              <Alert className="bg-blue-950/50 border-blue-900">
                <AlertDescription className="text-blue-200 text-sm">
                  As a Sales Agent, you'll receive a unique referral code after registration to share with potential
                  customers.
                </AlertDescription>
              </Alert>
            )}

            {formData.role === "WRITER" && (
              <Alert className="bg-blue-950/50 border-blue-900">
                <AlertDescription className="text-blue-200 text-sm">
                  As a Writer, you can bid on available orders and earn money by completing assignments.
                </AlertDescription>
              </Alert>
            )}

            {formData.role === "EDITOR" && (
              <Alert className="bg-blue-950/50 border-blue-900">
                <AlertDescription className="text-blue-200 text-sm">
                  As an Editor, you'll review completed work to ensure quality before delivery to customers.
                </AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            <div className="text-center text-sm text-slate-400">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
