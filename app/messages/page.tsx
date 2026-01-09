"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageSquare } from "lucide-react"
import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { messageService, type Message } from "@/lib/api/message.service"

interface Conversation {
  id: string
  orderNumber: string
  participant: string
  unread: number
  lastMessage: string
}

export default function MessagesPage() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMessages = async () => {
      try {
        setLoading(true)
        const userId = user?.id ? Number(user.id) : 0
        const messages = await messageService.getUserMessages(userId)

        // Group messages by order to create conversations
        const grouped: Record<string, Message[]> = {}
        messages.forEach((msg) => {
          if (!grouped[msg.orderId]) {
            grouped[msg.orderId] = []
          }
          grouped[msg.orderId].push(msg)
        })

        const convs = Object.entries(grouped).map(([orderId, msgs]) => ({
          id: orderId,
          orderNumber: `10${orderId}`,
          participant:
            msgs[0]?.senderId === Number(user?.id) ? `User ${msgs[0]?.receiverId}` : `User ${msgs[0]?.senderId}`,
          unread: msgs.filter((m) => !m.isRead && m.receiverId === Number(user?.id)).length,
          lastMessage: msgs[msgs.length - 1]?.messageText || "",
        }))

        setConversations(convs)
      } catch (err) {
        console.error("[v0] Error loading messages:", err)
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) {
      loadMessages()
    }
  }, [user?.id])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Messages</h1>
          <p className="text-slate-400 mt-1">View all your conversations</p>
        </div>

        <div className="grid gap-4">
          {loading ? (
            <p className="text-slate-400">Loading messages...</p>
          ) : conversations.length === 0 ? (
            <p className="text-slate-400">No messages yet</p>
          ) : (
            conversations.map((conv) => (
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
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
