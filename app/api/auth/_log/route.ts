import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma-client"
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { userId, action, details } = await request.json()

    const log = await prisma.authLog.create({
      data: {
        userId,
        action,
        details,
      },
    })

    return Response.json(log)
  } catch (error) {
    console.error("Auth log error:", error)
    return Response.json(
      { error: "Failed to log auth action" },
      { status: 500 }
    )
  }
} 