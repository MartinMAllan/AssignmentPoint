import { NextResponse } from "next/server"
import { mockOrders } from "@/lib/mock-data"

export async function GET() {
  try {
    const disputedOrders = mockOrders.filter((o) => o.status === "disputed")
    const stats = {
      open: Math.ceil(disputedOrders.length * 0.5),
      investigating: Math.ceil(disputedOrders.length * 0.3),
      resolved: Math.ceil(disputedOrders.length * 0.2),
    }

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error("[v0] Disputes stats error:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch dispute stats" }, { status: 500 })
  }
}
