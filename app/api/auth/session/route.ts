import { getServerSession } from "next-auth/next"
import { authConfig } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await getServerSession(authConfig)
    return Response.json(session)
  } catch (error) {
    console.error("Session error:", error)
    return Response.json(
      { error: "Failed to get session" },
      { status: 500 }
    )
  }
} 