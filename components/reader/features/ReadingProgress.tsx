"use client"

import React from "react"
import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface ReadingProgressProps {
  progress: number
  currentPage: number
  totalPages: number
  className?: string
}

export function ReadingProgress({
  progress,
  currentPage,
  totalPages,
  className
}: ReadingProgressProps) {
  return (
    <div className={cn("fixed top-0 left-0 right-0 z-50", className)}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-4xl mx-auto px-4 py-2"
      >
        <div className="bg-background/80 backdrop-blur-sm rounded-b-lg p-2 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <span className="text-sm font-medium">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress
            value={progress}
            className="h-1"
          />
        </div>
      </motion.div>
    </div>
  )
} 