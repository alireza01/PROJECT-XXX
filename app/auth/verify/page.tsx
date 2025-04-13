"use client"

import { useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Mail, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function VerifyPage() {
  useEffect(() => {
    // Check URL for confirmation token and handle if present
  }, [])

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
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Mail className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">تأیید ایمیل</CardTitle>
            <CardDescription className="text-muted-foreground">لطفاً ایمیل خود را بررسی کنید</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">
              ما یک ایمیل تأیید برای شما ارسال کردیم. لطفاً روی لینک موجود در ایمیل کلیک کنید تا حساب کاربری شما فعال
              شود.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              اگر ایمیلی دریافت نکردید، لطفاً پوشه اسپم خود را بررسی کنید یا با پشتیبانی تماس بگیرید.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                /* Resend verification email logic */
              }}
            >
              ارسال مجدد ایمیل تأیید
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/auth/login" className="text-primary font-medium hover:underline inline-flex items-center">
              بازگشت به صفحه ورود
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
