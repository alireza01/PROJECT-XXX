import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma-client"

export async function POST(request: Request) {
  try {
    const { userId, action, details } = await request.json()

    const log = await prisma.authLog.create({
      data: {
        userId,
        action,
        details,
      },
    })

    return NextResponse.json(log)
  } catch (error) {
    console.error("Auth log error:", error)
    return NextResponse.json(
      { error: "Failed to log auth action" },
      { status: 500 }
    )
  }
} 