"use client"

import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { VocabularyLevel } from "@/types/vocabulary"

interface WordPosition {
  word: string
  start: number
  end: number
  level: VocabularyLevel
}

interface HighlightedTextProps {
  content: string
  wordPositions: WordPosition[]
  userLevel: VocabularyLevel
  className?: string
}

export function HighlightedText({
  content,
  wordPositions,
  userLevel,
  className
}: HighlightedTextProps) {
  const getWordLevelColor = (level: VocabularyLevel) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 dark:bg-green-900/30"
      case "intermediate":
        return "bg-yellow-100 dark:bg-yellow-900/30"
      case "advanced":
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
            {content.slice(lastIndex, pos.start)}
          </span>
        )
      }

      // Add the highlighted word
      const word = content.slice(pos.start, pos.end)
      const isAboveUserLevel = 
        ((userLevel === "beginner") && 
         (pos.level !== "beginner")) ||
        ((userLevel === "intermediate") && 
         (pos.level === "advanced"))

      elements.push(
        <motion.span
          key={`word-${index}`}
          className={cn(
            "cursor-pointer transition-colors",
            isAboveUserLevel && getWordLevelColor(pos.level)
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {word}
        </motion.span>
      )

      lastIndex = pos.end
    })

    // Add remaining text
    if (lastIndex < content.length) {
      elements.push(
        <span key="text-end">
          {content.slice(lastIndex)}
        </span>
      )
    }

    return elements
  }

  return (
    <div className={cn("leading-relaxed", className)}>
      {renderContent()}
    </div>
  )
} 