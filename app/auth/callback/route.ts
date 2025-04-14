import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) {
        // Redirect to the dashboard or the page the user was trying to access
        const redirectTo = requestUrl.searchParams.get('redirectTo') || '/dashboard'
        return NextResponse.redirect(new URL(redirectTo, request.url))
      }
    } catch (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(new URL('/auth/login?error=CallbackError', request.url))
    }
  }

  // If no code is present, redirect to login
  return NextResponse.redirect(new URL('/auth/login', request.url))
} 