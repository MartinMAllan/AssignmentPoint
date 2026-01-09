"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { userService } from "@/lib/api/user.service"
import { Search, MoreVertical, Eye, UserX, UserCheck, Mail } from "lucide-react"
import { useState, useEffect } from "react"
import type { User } from "@/lib/types"

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await userService.getAllUsers(roleFilter || undefined)
        setUsers(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch users")
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [roleFilter])

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      writer: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      customer: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      admin: "bg-red-500/10 text-red-500 border-red-500/20",
      sales_agent: "bg-green-500/10 text-green-500 border-green-500/20",
      editor: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      writer_manager: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    }
    return colors[role] || "bg-slate-500/10 text-slate-500"
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">User Management</h1>
          <p className="text-slate-400 mt-1">Manage all platform users and their roles</p>
        </div>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-100">All Users</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-700 text-slate-100"
                  />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={roleFilter === null ? "default" : "outline"}
                  onClick={() => setRoleFilter(null)}
                  size="sm"
                >
                  All Roles
                </Button>
                <Button
                  variant={roleFilter === "writer" ? "default" : "outline"}
                  onClick={() => setRoleFilter("writer")}
                  size="sm"
                >
                  Writers
                </Button>
                <Button
                  variant={roleFilter === "customer" ? "default" : "outline"}
                  onClick={() => setRoleFilter("customer")}
                  size="sm"
                >
                  Customers
                </Button>
                <Button
                  variant={roleFilter === "sales_agent" ? "default" : "outline"}
                  onClick={() => setRoleFilter("sales_agent")}
                  size="sm"
                >
                  Sales Agents
                </Button>
              </div>
            </div>

            {loading && <div className="text-center text-slate-400 py-8">Loading users...</div>}
            {error && <div className="text-center text-red-400 py-8">Error: {error}</div>}
            {!loading && !error && (
              <div className="rounded-md border border-slate-800">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-800 hover:bg-slate-800/50">
                      <TableHead className="text-slate-300">Name</TableHead>
                      <TableHead className="text-slate-300">Email</TableHead>
                      <TableHead className="text-slate-300">Role</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                      <TableHead className="text-slate-300">Joined</TableHead>
                      <TableHead className="text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className="border-slate-800 hover:bg-slate-800/50">
                        <TableCell className="font-medium text-slate-300">
                          {user.firstName} {user.lastName}
                        </TableCell>
                        <TableCell className="text-slate-400">{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getRoleBadgeColor(user.role)}>
                            {user.role.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={user.isActive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-400">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                              <DropdownMenuItem className="text-slate-300 focus:bg-slate-700">
                                <Eye className="mr-2 h-4 w-4" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-slate-300 focus:bg-slate-700">
                                <Mail className="mr-2 h-4 w-4" />
                                Send Message
                              </DropdownMenuItem>
                              {user.isActive ? (
                                <DropdownMenuItem className="text-orange-400 focus:bg-slate-700">
                                  <UserX className="mr-2 h-4 w-4" />
                                  Deactivate User
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem className="text-green-400 focus:bg-slate-700">
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Activate User
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
