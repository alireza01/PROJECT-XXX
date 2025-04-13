"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Settings,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"
import { useSupabaseAuth } from "@/hooks/use-supabase-auth"
import { BookReaderIcon, LibraryIcon, ProfileIcon } from "@/components/icons"

const routes = [
  {
    title: "داشبورد",
    href: "/dashboard",
    icon: BookReaderIcon,
  },
  {
    title: "کتابخانه",
    href: "/library",
    icon: LibraryIcon,
  },
  {
    title: "پروفایل",
    href: "/profile",
    icon: ProfileIcon,
  },
  {
    title: "تنظیمات",
    href: "/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const { user } = useSupabaseAuth()

  if (!user) return null

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? "5rem" : "16rem" }}
      className="fixed right-0 top-16 h-[calc(100vh-4rem)] border-l border-gold-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between p-4">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-lg font-semibold text-gold-800 dark:text-gold-200"
              >
                منو
              </motion.h2>
            )}
          </AnimatePresence>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 text-gold-800 dark:text-gold-200"
          >
            {isCollapsed ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>

        <nav className="flex-1 space-y-1 p-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === route.href
                  ? "bg-gold-100 text-gold-800 dark:bg-gray-800 dark:text-gold-200"
                  : "text-gold-800 hover:bg-gold-100 dark:text-gold-200 dark:hover:bg-gray-800"
              )}
            >
              <route.icon className="h-4 w-4" />
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    {route.title}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          ))}
        </nav>
      </div>
    </motion.div>
  )
} 