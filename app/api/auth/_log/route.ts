import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    const { userId, action, details } = await request.json()

    const { data: log, error } = await supabase
      .from('auth_logs')
      .insert({
        user_id: userId,
        action,
        details,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Auth log error:', error)
      return Response.json(
        { error: 'Failed to log auth action' },
        { status: 500 }
      )
    }

    return Response.json(log)
  } catch (error) {
    console.error('Auth log error:', error)
    return Response.json(
      { error: 'Failed to log auth action' },
      { status: 500 }
    )
  }
} 