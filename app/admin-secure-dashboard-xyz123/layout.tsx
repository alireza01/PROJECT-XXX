"use client"

import { SidebarInset } from "@/components/ui/sidebar"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AdminNav } from "@/components/admin/admin-nav"

import { useState } from "react"
import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  LayoutDashboard,
  Settings,
  Users,
  LogOut,
  FileText,
  Menu,
  ChevronDown,
  Upload,
  BarChart,
  MessageSquare,
  CreditCard,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"

interface AdminLayoutProps {
  children: ReactNode
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== "admin") {
    redirect("/")
  }

  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(true)
  const pathname = usePathname()

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-[#F8F3E9]">
        {/* Sidebar */}
        <Sidebar variant="inset" className="border-l border-[#E6D7B8]">
          <SidebarHeader className="border-b border-[#E6D7B8]">
            <div className="flex items-center justify-between p-4">
              <Link href="/admin-secure-dashboard-xyz123" className="flex items-center gap-2">
                <div className="relative w-10 h-10 bg-gradient-to-br from-[#E6B980] to-[#D29E64] rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  B
                </div>
                <div>
                  <span className="font-bold text-xl text-[#5D4B35]">کتاب‌خوان</span>
                  <span className="mr-2 px-2 py-0.5 text-xs bg-[#E6D7B8] text-[#5D4B35] rounded-md">مدیریت</span>
                </div>
              </Link>
              <SidebarTrigger />
            </div>
          </SidebarHeader>

          <SidebarContent className="p-0">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin-secure-dashboard-xyz123"} className="py-3">
                  <Link href="/admin-secure-dashboard-xyz123">
                    <LayoutDashboard className="ml-2 h-5 w-5 text-[#D29E64]" />
                    داشبورد
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <Collapsible open={isCollapsibleOpen} onOpenChange={setIsCollapsibleOpen} className="w-full">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="py-3">
                      <BookOpen className="ml-2 h-5 w-5 text-[#D29E64]" />
                      مدیریت کتاب‌ها
                      <ChevronDown
                        className={cn(
                          "mr-auto h-4 w-4 transition-transform duration-200",
                          isCollapsibleOpen ? "rotate-180" : "",
                        )}
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </SidebarMenuItem>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={pathname === "/admin-secure-dashboard-xyz123/books"}>
                        <Link href="/admin-secure-dashboard-xyz123/books">همه کتاب‌ها</Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={pathname === "/admin-secure-dashboard-xyz123/books/add"}>
                        <Link href="/admin-secure-dashboard-xyz123/books/add">افزودن کتاب جدید</Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        asChild
                        isActive={pathname === "/admin-secure-dashboard-xyz123/books/categories"}
                      >
                        <Link href="/admin-secure-dashboard-xyz123/books/categories">دسته‌بندی‌ها</Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/admin-secure-dashboard-xyz123/words"}
                  className="py-3"
                >
                  <Link href="/admin-secure-dashboard-xyz123/words">
                    <FileText className="ml-2 h-5 w-5 text-[#D29E64]" />
                    مدیریت واژگان
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/admin-secure-dashboard-xyz123/users"}
                  className="py-3"
                >
                  <Link href="/admin-secure-dashboard-xyz123/users">
                    <Users className="ml-2 h-5 w-5 text-[#D29E64]" />
                    مدیریت کاربران
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/admin-secure-dashboard-xyz123/uploads"}
                  className="py-3"
                >
                  <Link href="/admin-secure-dashboard-xyz123/uploads">
                    <Upload className="ml-2 h-5 w-5 text-[#D29E64]" />
                    آپلود فایل‌ها
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/admin-secure-dashboard-xyz123/analytics"}
                  className="py-3"
                >
                  <Link href="/admin-secure-dashboard-xyz123/analytics">
                    <BarChart className="ml-2 h-5 w-5 text-[#D29E64]" />
                    آمار و تحلیل
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/admin-secure-dashboard-xyz123/comments"}
                  className="py-3"
                >
                  <Link href="/admin-secure-dashboard-xyz123/comments">
                    <MessageSquare className="ml-2 h-5 w-5 text-[#D29E64]" />
                    مدیریت نظرات
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/admin-secure-dashboard-xyz123/payments"}
                  className="py-3"
                >
                  <Link href="/admin-secure-dashboard-xyz123/payments">
                    <CreditCard className="ml-2 h-5 w-5 text-[#D29E64]" />
                    مدیریت پرداخت‌ها
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/admin-secure-dashboard-xyz123/settings"}
                  className="py-3"
                >
                  <Link href="/admin-secure-dashboard-xyz123/settings">
                    <Settings className="ml-2 h-5 w-5 text-[#D29E64]" />
                    تنظیمات
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="border-t border-[#E6D7B8] p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-9 w-9 border-2 border-[#E6D7B8]">
                  <AvatarImage src="/placeholder.svg" alt="تصویر مدیر" />
                  <AvatarFallback className="bg-[#E6B980] text-white">م</AvatarFallback>
                </Avatar>
                <div className="mr-2">
                  <p className="text-sm font-medium text-[#5D4B35]">مدیر سیستم</p>
                  <p className="text-xs text-[#7D6E56]">admin@booklearn.ir</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-red-500 hover:bg-red-50 hover:text-red-500"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main content */}
        <SidebarInset>
          <div className="flex flex-col flex-1 overflow-hidden">
            <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-[#E6D7B8]">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden rounded-full text-[#5D4B35] hover:bg-[#E6D7B8]/50 hover:text-[#5D4B35]"
                >
                  <Menu className="h-6 w-6" />
                </Button>
                <h1 className="text-lg font-bold text-[#5D4B35] mr-2">پنل مدیریت کتاب‌خوان</h1>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  className="border-[#E6D7B8] text-[#5D4B35] hover:bg-[#E6D7B8]/50 hover:text-[#5D4B35]"
                >
                  <Link href="/" target="_blank">
                    مشاهده سایت
                  </Link>
                </Button>
                <Avatar className="h-9 w-9 border-2 border-[#E6D7B8]">
                  <AvatarImage src="/placeholder.svg" alt="تصویر مدیر" />
                  <AvatarFallback className="bg-[#E6B980] text-white">م</AvatarFallback>
                </Avatar>
              </div>
            </header>

            <main className="flex-1 overflow-y-auto p-6 bg-[#F8F3E9]">{children}</main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
