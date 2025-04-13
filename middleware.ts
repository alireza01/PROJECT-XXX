// @/middleware.ts
import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { NextRequestWithAuth, withAuth } from "next-auth/middleware"
import type { NextRequest } from 'next/server'
import { logError } from './lib/logger'

// Define protected routes
const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/books",
  "/categories",
  "/authors",
  "/admin",
]

// Define admin-only routes
const adminRoutes = ["/admin"]

// CORS configuration
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Max-Age': '86400', // 24 hours
}

export default withAuth(
  async function middleware(req: NextRequestWithAuth) {
    try {
      const token = await getToken({ req })
      const isAuth = !!token
      const isAuthPage = req.nextUrl.pathname.startsWith("/auth")
      const isProtectedRoute = protectedRoutes.some(route => 
        req.nextUrl.pathname.startsWith(route)
      )
      const isAdminRoute = adminRoutes.some(route => 
        req.nextUrl.pathname.startsWith(route)
      )

      // Handle CORS
      if (req.method === 'OPTIONS') {
        return new NextResponse(null, { headers: corsHeaders })
      }

      // Redirect authenticated users away from auth pages
      if (isAuthPage) {
        if (isAuth) {
          return NextResponse.redirect(new URL("/dashboard", req.url))
        }
        return null
      }

      // Redirect unauthenticated users to login
      if (!isAuth && isProtectedRoute) {
        let from = req.nextUrl.pathname
        if (req.nextUrl.search) {
          from += req.nextUrl.search
        }
        return NextResponse.redirect(
          new URL(`/auth/login?from=${encodeURIComponent(from)}`, req.url)
        )
      }

      // Redirect non-admin users away from admin routes
      if (isAdminRoute && token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }

      // Add CORS headers to all responses
      const response = NextResponse.next()
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
      })

      return response
    } catch (error) {
      logError(error as Error, {
        path: req.nextUrl.pathname,
        method: req.method,
        ip: req.ip || req.headers.get('x-forwarded-for') || 'unknown',
      })
      return new NextResponse(
        JSON.stringify({ error: 'Internal Server Error' }),
        { status: 500, headers: corsHeaders }
      )
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/books/:path*",
    "/categories/:path*",
    "/authors/:path*",
    "/admin/:path*",
    "/auth/:path*",
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
