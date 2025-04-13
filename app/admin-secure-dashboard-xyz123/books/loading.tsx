"use client"

import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <Loader2 className="h-10 w-10 text-amber-600 animate-spin" />
      <p className="text-amber-700/80 dark:text-amber-400/80 text-sm font-medium">در حال بارگذاری...</p>
    </div>
  )
}