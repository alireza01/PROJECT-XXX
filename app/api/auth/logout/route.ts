import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    
    // Clear auth related cookies
    cookieStore.delete('admin-token')
    cookieStore.delete('admin-session')

    return Response.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Logout error:', error)
    return Response.json({ error: 'Failed to logout' }, { status: 500 })
  }
} 