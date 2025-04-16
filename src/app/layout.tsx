import { Inter } from 'next/font/google'
import { SupabaseAuthProvider } from '@/components/providers/supabase-auth-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from 'sonner'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata = {
  title: {
    default: 'Ketab Yar - Your Reading Companion',
    template: '%s | Ketab Yar'
  },
  description: 'A modern book sharing and reading platform',
  keywords: ['books', 'reading', 'library', 'book sharing', 'digital library'],
  authors: [{ name: 'Ketab Yar Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ],
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className={`${inter.className} antialiased min-h-screen bg-background`}>
        <ThemeProvider>
          <SupabaseAuthProvider>
            {children}
            <Toaster position="bottom-right" richColors />
            <Analytics />
            <SpeedInsights />
          </SupabaseAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
} 