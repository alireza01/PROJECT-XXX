"use client"

import React from "react"
import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ReadingProgressProps {
  currentPage: number
  totalPages: number
  className?: string
}

export function ReadingProgress({
  currentPage,
  totalPages,
  className
}: ReadingProgressProps) {
  const progress = (currentPage / totalPages) * 100

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Reading Progress</span>
            <span className="text-sm text-muted-foreground">
              {currentPage} / {totalPages} pages
            </span>
          </div>
          <div className="relative h-2">
            <Progress value={progress} className="h-2" />
            <motion.div
              className="absolute top-0 left-0 h-full bg-primary/20"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 