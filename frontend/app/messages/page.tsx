"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Loader2 } from "lucide-react"

interface Conversation {
  id: string
  orderNumber: string
  participant: string
  unread: number
  lastMessage: string
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/messages/conversations")
        const result = await response.json()
        setConversations(result.data || [])
      } catch (error) {
        console.error("[v0] Failed to fetch conversations:", error)
        setConversations([])
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Messages</h1>
          <p className="text-slate-400 mt-1">View all your conversations</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">No conversations yet</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {conversations.map((conv) => (
              <Card
                key={conv.id}
                className="bg-slate-900 border-slate-800 p-4 hover:border-slate-700 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {conv.participant.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-slate-100">{conv.participant}</p>
                      <Badge variant="outline" className="text-xs">
                        Order #{conv.orderNumber}
                      </Badge>
                      {conv.unread > 0 && <Badge className="bg-primary text-primary-foreground">{conv.unread}</Badge>}
                    </div>
                    <p className="text-sm text-slate-400">{conv.lastMessage}</p>
                  </div>
                  <MessageSquare className="h-5 w-5 text-slate-400" />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
