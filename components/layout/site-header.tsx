"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import Button from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Menu, Search, X, LogIn, BookOpen } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useSupabaseAuth } from "@/hooks/use-supabase-auth"
import { UserAccountNav } from "@/components/user-account-nav"

interface SiteHeaderProps {
  className?: string
}

interface UserAccountNavProps {
  user: any
}

export function SiteHeader({ className }: SiteHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, isLoading } = useSupabaseAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const routes = [
    {
      title: "خانه",
      href: "/",
    },
    {
      title: "کتابخانه",
      href: "/library",
    },
    {
      title: "دسته‌بندی‌ها",
      href: "/categories",
    },
  ]

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gold-200 dark:border-gray-800 shadow-sm"
          : "bg-transparent",
        className
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="relative w-10 h-10 bg-gradient-to-br from-gold-300 to-gold-400 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
            >
              <BookOpen className="h-5 w-5" />
            </motion.div>
            <span className="font-bold text-xl hidden sm:inline-block text-gold-800 dark:text-gold-200">کتاب‌خوان</span>
          </Link>

          <nav className="hidden md:flex space-x-6 space-x-reverse mr-4">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-gold-400 relative group",
                  pathname === route.href ? "text-gold-400" : "text-gold-800 dark:text-gold-200",
                )}
              >
                {route.title}
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gold-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-gold-800 dark:text-gold-200 hover:bg-gold-200/50 dark:hover:bg-gray-800 hover:text-gold-800 dark:hover:text-gold-200"
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">جستجو</span>
          </Button>

          <ThemeToggle />

          {!isLoading && (
            <>
              {user ? (
                <UserAccountNav user={user} />
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Button
                    variant="ghost"
                    className="text-gold-800 dark:text-gold-200 hover:bg-gold-200/50 dark:hover:bg-gray-800 hover:text-gold-800 dark:hover:text-gold-200"
                    asChild
                  >
                    <Link href="/auth/login">ورود</Link>
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-gold-300 to-gold-400 hover:opacity-90 text-white shadow-md"
                    asChild
                  >
                    <Link href="/auth/signup">ثبت‌نام</Link>
                  </Button>
                </div>
              )}
            </>
          )}

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full text-gold-800 dark:text-gold-200 hover:bg-gold-200/50 dark:hover:bg-gray-800 hover:text-gold-800 dark:hover:text-gold-200"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">منو</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[80%] sm:w-[350px] pr-0 bg-gold-50 dark:bg-gray-900 border-l border-gold-200 dark:border-gray-800"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between py-4 pr-6">
                  <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="relative w-10 h-10 bg-gradient-to-br from-gold-300 to-gold-400 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-xl text-gold-800 dark:text-gold-200">کتاب‌خوان</span>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full text-gold-800 dark:text-gold-200 hover:bg-gold-200/50 dark:hover:bg-gray-800 hover:text-gold-800 dark:hover:text-gold-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="h-5 w-5" />
                    <span className="sr-only">بستن</span>
                  </Button>
                </div>

                <nav className="flex flex-col gap-1 pr-6 mt-6">
                  {routes.map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center py-3 text-lg font-medium transition-colors hover:text-gold-400",
                        pathname === route.href ? "text-gold-400" : "text-gold-800 dark:text-gold-200",
                      )}
                    >
                      {route.title}
                    </Link>
                  ))}
                </nav>

                <div className="mt-auto pr-6 pb-8 pt-4 border-t border-gold-200 dark:border-gray-800">
                  {!isLoading && (
                    <div className="grid gap-2 mt-4">
                      {user ? (
                        <div className="flex items-center gap-4 mb-4">
                          <Avatar className="h-9 w-9 border-2 border-gold-200 dark:border-gray-800">
                            <AvatarImage src="/placeholder.svg" alt="تصویر کاربر" />
                            <AvatarFallback className="bg-gold-300 text-white">
                              {user.email?.charAt(0).toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-gold-800 dark:text-gold-200">{user.email}</p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Button
                            className="bg-gradient-to-r from-gold-300 to-gold-400 hover:opacity-90 text-white shadow-md"
                            asChild
                          >
                            <Link href="/auth/signup" onClick={() => setIsMobileMenuOpen(false)}>
                              ثبت‌نام
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            className="border-gold-400 text-gold-800 dark:text-gold-200 hover:bg-gold-200/50 dark:hover:bg-gray-800 hover:text-gold-800 dark:hover:text-gold-200"
                            asChild
                          >
                            <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                              <LogIn className="ml-2 h-4 w-4" />
                              ورود
                            </Link>
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  )
}
