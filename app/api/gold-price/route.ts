import { NextResponse } from "next/server"

export async function GET() {
  try {
    // In a real app, this would fetch from an external API
    // For now, return a mock price
    return NextResponse.json({
      price: 6245.75,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch gold price" }, { status: 500 })
  }
}
