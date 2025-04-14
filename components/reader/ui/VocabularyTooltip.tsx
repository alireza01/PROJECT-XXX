"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { VocabularyLevel } from "@/types"

interface VocabularyTooltipProps {
  word: string
  level: VocabularyLevel
  position: { x: number; y: number }
  onClose: () => void
  userLevel: VocabularyLevel
  className?: string
}

export function VocabularyTooltip({
  word,
  level,
  position,
  onClose,
  userLevel,
  className
}: VocabularyTooltipProps) {
  const getLevelColor = (level: VocabularyLevel) => {
    switch (level) {
      case "BEGINNER":
      case "beginner":
        return "text-green-600 dark:text-green-400"
      case "INTERMEDIATE":
      case "intermediate":
        return "text-yellow-600 dark:text-yellow-400"
      case "ADVANCED":
      case "advanced":
        return "text-red-600 dark:text-red-400"
      default:
        return ""
    }
  }

  const getLevelBadge = (level: VocabularyLevel) => {
    switch (level) {
      case "BEGINNER":
      case "beginner":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
      case "INTERMEDIATE":
      case "intermediate":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200"
      case "ADVANCED":
      case "advanced":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
      default:
        return ""
    }
  }

  const isAboveUserLevel = 
    ((userLevel === "BEGINNER" || userLevel === "beginner") && 
     (level !== "BEGINNER" && level !== "beginner")) ||
    ((userLevel === "INTERMEDIATE" || userLevel === "intermediate") && 
     (level === "ADVANCED" || level === "advanced"))

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "fixed z-50",
          className
        )}
        style={{
          left: `${position.x}px`,
          top: `${position.y + 20}px`,
          transform: "translateX(-50%)"
        }}
      >
        <Card className="shadow-lg border-2 min-w-[200px]">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{word}</h3>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-medium",
                    getLevelBadge(level)
                  )}>
                    {level}
                  </span>
                </div>
                {isAboveUserLevel && (
                  <p className="text-sm text-muted-foreground">
                    This word is above your current level ({userLevel})
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
} 