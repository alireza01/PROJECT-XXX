"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Keyboard } from "lucide-react"

export function HelpDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          data-help-trigger
          className="text-muted-foreground"
        >
          <Keyboard className="h-5 w-5" />
          <span className="sr-only">راهنمای کلیدهای میانبر</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>کلیدهای میانبر</DialogTitle>
          <DialogDescription>
            برای استفاده سریع‌تر از امکانات سایت می‌توانید از کلیدهای میانبر زیر
            استفاده کنید.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-medium">تغییر تم</span>
            <kbd className="font-mono">Ctrl + Shift + T</kbd>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-medium">صفحه اصلی</span>
            <kbd className="font-mono">Ctrl + Shift + H</kbd>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-medium">کتاب‌ها</span>
            <kbd className="font-mono">Ctrl + Shift + B</kbd>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-medium">پروفایل</span>
            <kbd className="font-mono">Ctrl + Shift + P</kbd>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-medium">جستجو</span>
            <kbd className="font-mono">Ctrl + K</kbd>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-medium">راهنما</span>
            <kbd className="font-mono">Ctrl + Shift + /</kbd>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 