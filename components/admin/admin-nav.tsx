"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Book,
  BookOpen,
  FileText,
  Home,
  Settings,
  Users,
  Bookmark,
  BookmarkCheck,
  BookmarkX,
  BookmarkPlus,
  BookmarkMinus,
  BookmarkStar,
  BookmarkHeart,
  BookmarkIcon,
  BookmarkCheckIcon,
  BookmarkXIcon,
  BookmarkPlusIcon,
  BookmarkMinusIcon,
  BookmarkStarIcon,
  BookmarkHeartIcon,
} from "lucide-react"

const adminNavItems = [
  {
    title: "داشبورد",
    href: "/admin-secure-dashboard-xyz123",
    icon: Home,
  },
  {
    title: "کتاب‌ها",
    href: "/admin-secure-dashboard-xyz123/books",
    icon: Book,
  },
  {
    title: "واژگان",
    href: "/admin-secure-dashboard-xyz123/words",
    icon: FileText,
  },
  {
    title: "کاربران",
    href: "/admin-secure-dashboard-xyz123/users",
    icon: Users,
  },
  {
    title: "تنظیمات",
    href: "/admin-secure-dashboard-xyz123/settings",
    icon: Settings,
  },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
          {adminNavItems.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "flex items-center space-x-2",
                    pathname === item.href && "bg-accent"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Button>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
} 