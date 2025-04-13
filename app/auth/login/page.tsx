// @/app/auth/login/page.tsx
"use client"

import type React from "react"
import { useState, useEffect } from "react" // Added useEffect
import { useRouter, useSearchParams } from "next/navigation" // Added useSearchParams
import Link from "next/link"
import { motion } from "framer-motion"
import { signIn } from "next-auth/react" // Import signIn from next-auth/react
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
// Removed: import { useSupabaseAuth } from "@/hooks/use-supabase-auth"

// Map NextAuth error codes to user-friendly Persian messages
const errorMessages: { [key: string]: string } = {
  CredentialsSignin: "ایمیل یا رمز عبور نامعتبر است.",
  Default: "خطا در ورود به سیستم. لطفا دوباره تلاش کنید.",
  OAuthSignin: "خطا در ورود با حساب گوگل.",
  OAuthCallback: "خطا در پردازش پاسخ گوگل.",
  OAuthCreateAccount: "خطا در ایجاد حساب کاربری با گوگل.",
  EmailCreateAccount: "خطا در ایجاد حساب کاربری با ایمیل.",
  Callback: "خطا در بازگشت به برنامه.",
  OAuthAccountNotLinked: "این ایمیل قبلا با روش دیگری ثبت نام شده است. لطفا با همان روش وارد شوید.",
  EmailSignin: "خطا در ارسال ایمیل ورود.",
  SessionRequired: "برای دسترسی به این صفحه نیاز به ورود دارید.",
}

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard" // Get callbackUrl or default
  const initialError = searchParams.get("error") // Get error from URL if redirected by NextAuth

  // Removed: const { signIn } = useSupabaseAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Set error from URL on initial load
  useEffect(() => {
    if (initialError) {
      setError(errorMessages[initialError] || errorMessages.Default)
    }
  }, [initialError])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false, // Handle redirect manually
        // callbackUrl: callbackUrl // Can be passed here too, but middleware handles redirect target
      })

      if (res?.error) {
        // Map error code to message
        throw new Error(res.error) // Throw error code to be caught below
      }

      if (res?.ok) {
        // Successful login
        router.push(callbackUrl) // Redirect to the intended page or dashboard
        router.refresh(); // Refresh server components
      } else {
         // Handle unexpected non-error response
         throw new Error("Default")
      }

    } catch (err: any) {
      const errorCode = err.message // Error code from signIn or "Default"
      setError(errorMessages[errorCode] || errorMessages.Default)
      console.error("Login Error:", errorCode);
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
        // Redirects to Google, then back to callbackUrl specified in middleware or default
        await signIn("google", { callbackUrl: callbackUrl });
        // Note: If signIn('google') fails before redirecting, it might throw or return an error.
        // However, common OAuth errors happen *after* redirecting back from Google,
        // which NextAuth handles by redirecting to this page with ?error=...
    } catch (err) {
        // This catch might not be reached for typical OAuth errors
        setError(errorMessages.OAuthSignin);
        console.error("Google Sign In Error:", err);
        setLoading(false); // Ensure loading stops if immediate error occurs
    }
    // No finally setLoading(false) here, as successful Google sign-in redirects away
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-none shadow-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold tracking-tight">ورود به کتاب‌یار</CardTitle>
            <CardDescription className="text-muted-foreground">وارد حساب کاربری خود شوید</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-4">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    dir="ltr" // Email is LTR
                    type="email"
                    placeholder="ایمیل"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 pr-4 text-right placeholder:text-right" // Adjust padding/text alignment
                    required
                    autoComplete="email"
                  />
                </div>
              </div>
              {/* Password Input */}
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    dir="ltr" // Password input is typically LTR
                    type={showPassword ? "text" : "password"}
                    placeholder="رمز عبور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 text-right placeholder:text-right" // Adjust padding/text alignment
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" // Centered vertically
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {/* Forgot Password Link - Consider implementing this later */}
                {/* <div className="text-left">
                  <Link href="/auth/reset-password" className="text-sm font-medium text-primary hover:underline">
                    فراموشی رمز عبور؟
                  </Link>
                </div> */}
              </div>
              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                disabled={loading}
              >
                {loading && !error ? ( // Show spinner only when loading and no error
                  <div className="flex items-center justify-center">
                    <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                    در حال ورود...
                  </div>
                ) : (
                  "ورود"
                )}
              </Button>
            </form>
            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">یا</span> {/* Use bg-card for better theme compatibility */}
              </div>
            </div>
            {/* Google Login Button */}
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin} // Updated onClick handler
              disabled={loading} // Disable while loading
            >
              {loading ? ( // Optional: Show loading state on Google button too
                 <div className="h-5 w-5 border-2 border-t-transparent border-muted-foreground rounded-full animate-spin mr-2"></div>
              ) : (
                <svg className="ml-2 h-4 w-4" viewBox="0 0 24 24"> {/* Adjusted margin to ml-2 for Farsi */}
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              ورود با گوگل
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              حساب کاربری ندارید؟{" "}
              <Link href="/auth/register" className="text-primary font-medium hover:underline">
                ثبت نام کنید
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
