"use client"

import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Level } from "@/lib/prisma-client"

interface WordPosition {
  word: string
  start: number
  end: number
  level: Level
}

interface HighlightedTextProps {
  content: string
  wordPositions: WordPosition[]
  userLevel: Level
  className?: string
}

export function HighlightedText({
  content,
  wordPositions,
  userLevel,
  className
}: HighlightedTextProps) {
  const getWordLevelColor = (level: Level) => {
    switch (level) {
      case "BEGINNER":
        return "bg-green-100 dark:bg-green-900/30"
      case "INTERMEDIATE":
        return "bg-yellow-100 dark:bg-yellow-900/30"
      case "ADVANCED":
        return "bg-red-100 dark:bg-red-900/30"
      default:
        return ""
    }
  }

  const renderContent = () => {
    if (!wordPositions.length) return content

    let lastIndex = 0
    const elements: React.ReactNode[] = []

    wordPositions.forEach((pos, index: number) => {
      // Add text before the word
      if (pos.start > lastIndex) {
        elements.push(
          <span key={`text-${index}`}>
            {content.substring(lastIndex, pos.start)}
          </span>
        )
      }

      // Add the highlighted word
      elements.push(
        <motion.span
          key={`word-${index}`}
          className={cn(
            "cursor-pointer hover:opacity-80 transition-opacity",
            getWordLevelColor(pos.level)
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {content.substring(pos.start, pos.end)}
        </motion.span>
      )

      lastIndex = pos.end
    })

    // Add remaining text
    if (lastIndex < content.length) {
      elements.push(
        <span key="remaining-text">
          {content.substring(lastIndex)}
        </span>
      )
    }

    return elements
  }

  return (
    <div className={cn("text-lg leading-relaxed", className)}>
      {renderContent()}
    </div>
  )
} 