import { NextResponse } from "next/server"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
    const { id } = await Promise.resolve(params)
    const body = await request.json()

    const response = await fetch(`${apiUrl}/admin/disputes/${id}/resolve`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Resolve dispute error:", error)
    return NextResponse.json({ success: false, message: "Failed to resolve dispute" }, { status: 500 })
  }
}
