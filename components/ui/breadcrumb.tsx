"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronLeft, Home } from "lucide-react"
import { cn } from "@/lib/utils"

const routeMap: Record<string, string> = {
  dashboard: "داشبورد",
  library: "کتابخانه",
  profile: "پروفایل",
  settings: "تنظیمات",
  books: "کتاب‌ها",
  categories: "دسته‌بندی‌ها",
  auth: "احراز هویت",
  login: "ورود",
  signup: "ثبت‌نام",
}

export function Breadcrumb() {
  const pathname = usePathname()
  const paths = pathname.split("/").filter(Boolean)

  if (paths.length <= 1) return null

  return (
    <nav className="flex items-center space-x-1 space-x-reverse text-sm text-gold-800 dark:text-gold-200">
      <Link
        href="/"
        className="flex items-center hover:text-gold-400 transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>
      {paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join("/")}`
        const isLast = index === paths.length - 1
        const title = routeMap[path] || path

        return (
          <div key={path} className="flex items-center">
            <ChevronLeft className="h-4 w-4 mx-1" />
            {isLast ? (
              <span className="font-medium">{title}</span>
            ) : (
              <Link
                href={href}
                className="hover:text-gold-400 transition-colors"
              >
                {title}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
