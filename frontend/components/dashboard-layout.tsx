"use client"

import type React from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback } from "./ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  DollarSign,
  Settings,
  LogOut,
  Users,
  Menu,
  Bell,
  Briefcase,
  Shield,
  BarChart3,
  Gavel,
  Plus,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  if (!user) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const getInitials = () => {
    return `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
  }

  const getRoleLabel = () => {
    const roleLabels: Record<string, string> = {
      writer: "Writer",
      admin: "Admin (CEO)",
      writer_manager: "Writer Manager",
      customer: "Customer",
      sales_agent: "Sales Agent",
      editor: "Editor",
    }
    return roleLabels[user.role] || user.role
  }

  const navigationItems =
    user.role === "admin"
      ? [
          { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
          { icon: FileText, label: "All Orders", href: "/admin/orders" },
          { icon: Gavel, label: "Manage Bids", href: "/admin/bids" },
          { icon: Users, label: "User Management", href: "/admin/users" },
          { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
          { icon: DollarSign, label: "Revenue", href: "/admin/revenue" },
          { icon: MessageSquare, label: "Messages", href: "/messages" },
          { icon: Shield, label: "Disputes", href: "/admin/disputes" },
          { icon: Settings, label: "Settings", href: "/admin/settings" },
        ]
      : user.role === "sales_agent"
        ? [
            { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
            { icon: Users, label: "My Customers", href: "/sales/customers" },
            { icon: FileText, label: "Customer Orders", href: "/orders" },
            { icon: DollarSign, label: "Commissions", href: "/transactions" },
            { icon: MessageSquare, label: "Messages", href: "/messages" },
          ]
        : user.role === "customer"
          ? [
              { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
              { icon: Plus, label: "Post Order", href: "/customer/post-order" },
              { icon: FileText, label: "My Orders", href: "/orders" },
              { icon: MessageSquare, label: "Messages", href: "/messages" },
              { icon: DollarSign, label: "Wallet & Deposits", href: "/customer/deposit" },
              { icon: DollarSign, label: "Billing", href: "/transactions" },
            ]
          : [
              { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
              ...(user.role === "writer"
                ? [
                    { icon: Briefcase, label: "Available Orders", href: "/available-orders" },
                    { icon: FileText, label: "My Bids", href: "/writer/bids" },
                  ]
                : []),
              { icon: FileText, label: "Orders", href: "/orders" },
              { icon: MessageSquare, label: "Messages", href: "/messages" },
              { icon: DollarSign, label: "Transactions", href: "/transactions" },
            ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/75">
        <div className="flex h-16 items-center gap-4 px-4">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">AP</span>
            </div>
            <span className="font-semibold text-lg hidden sm:inline-block">Assignment Point</span>
          </div>

          <div className="ml-auto flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-medium">
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="text-xs text-slate-400">{getRoleLabel()}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-slate-800 border-slate-700">
                <DropdownMenuLabel className="text-slate-200">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem className="text-slate-300 focus:bg-slate-700 focus:text-slate-100">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-slate-300 focus:bg-slate-700 focus:text-slate-100"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 border-r border-slate-800 bg-slate-900 transition-transform lg:translate-x-0`}
        >
          <nav className="flex flex-col gap-1 p-4">
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-slate-300 hover:bg-slate-800 hover:text-slate-100"
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
