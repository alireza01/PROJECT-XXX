// @/app/layout.tsx
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "../components/providers"

// Use Inter for better Latin support
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Modern Web App",
  description: "A modern web application built with Next.js, Tailwind CSS, and Supabase",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <main className="min-h-screen bg-background">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}