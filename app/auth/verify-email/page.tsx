"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function VerifyEmail() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push("/")
      }
    }
    checkSession()
  }, [router, supabase])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight">
            Check your email
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We sent you a verification link. Please check your email to verify your account.
          </p>
        </div>
        <div className="rounded-md bg-primary/10 p-4">
          <p className="text-sm text-primary">
            Once you verify your email, you can sign in to your account.
          </p>
        </div>
      </div>
    </div>
  )
} 