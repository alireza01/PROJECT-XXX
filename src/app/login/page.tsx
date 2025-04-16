'use client';

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useSupabaseAuth } from '@/hooks/use-supabase-auth'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirectTo?: string }
}) {
  const { signInWithGoogle, user } = useSupabaseAuth()
  const router = useRouter()

  // If user is already logged in, redirect to home or the requested page
  useEffect(() => {
    if (user) {
      router.push(searchParams.redirectTo || '/')
    }
  }, [user, router, searchParams.redirectTo])

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Welcome to Ketab Yar</CardTitle>
          <CardDescription className="text-center">
            Sign in to access your reading journey
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => signInWithGoogle()}
          >
            <svg
              className="mr-2 h-4 w-4"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="google"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path
                fill="currentColor"
                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
              ></path>
            </svg>
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 