// @/app/layout.tsx
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/providers/ThemeProvider"
import { AdminProvider } from "@/providers/AdminProvider"
import { Toaster } from "@/components/ui/toaster"
import { SiteHeader } from "@/components/layout/site-header"
import { PageTransition } from "@/components/ui/page-transition"
import { Sidebar } from "@/components/layout/sidebar"
import { Breadcrumb } from "@/components/ui/breadcrumb"

// Use Inter for better Latin support
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "کتاب یار - پلتفرم خواندن کتاب‌های انگلیسی",
  description: "پلتفرم خواندن کتاب‌های انگلیسی با ترجمه هوشمند و کمک به یادگیری زبان",
  generator: 'KetabYar Dev Team',
  keywords: ["یادگیری زبان", "کتاب انگلیسی", "آموزش زبان", "کتاب‌یار"],
  authors: [{ name: "KetabYar Team" }],
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  // Open Graph data for better social sharing
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    url: 'https://ketabyar.com',
    title: 'کتاب‌یار - پلتفرم هوشمند یادگیری زبان با کتاب',
    description: 'با کتاب‌یار، خواندن کتاب‌های انگلیسی را به تجربه‌ای لذت‌بخش و مؤثر برای یادگیری زبان تبدیل کنید.',
    siteName: 'کتاب‌یار',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa" dir="rtl" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <AdminProvider>
            {/* Main content wrapper */}
            <div className="flex flex-col min-h-screen bg-gradient-to-b from-amber-50/80 via-white to-amber-50/30 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
              {/* Header */}
              <SiteHeader className="glass-effect sticky top-0 z-50" />
              
              {/* Sidebar */}
              <Sidebar className="glass-effect fixed right-0 top-16 h-[calc(100vh-4rem)] w-64 border-l" />
              
              {/* Main content with padding for fixed header */}
              <main className="flex-1 pt-16 pr-64">
                <div className="container mx-auto px-4 py-4">
                  <Breadcrumb className="glass-effect rounded-lg p-2" />
                </div>
                <PageTransition className="animate-fade-in">
                  {children}
                </PageTransition>
              </main>
            </div>
            
            {/* Toast notifications */}
            <Toaster />
          </AdminProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}