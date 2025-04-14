"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { VocabularyLevel } from "@/types/vocabulary"

interface VocabularyTooltipProps {
  word: string
  level: VocabularyLevel
  position: { x: number; y: number }
  onClose: () => void
  userLevel: VocabularyLevel
  children?: React.ReactNode
}

export function VocabularyTooltip({
  word,
  level,
  position,
  onClose,
  userLevel,
  children,
}: VocabularyTooltipProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleAddToVocabulary = async () => {
    setIsLoading(true)
    try {
      // API call to add word to user's vocabulary
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulated API call
      onClose()
    } catch (error) {
      console.error("Failed to add word to vocabulary:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getLevelColor = (level: VocabularyLevel) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "intermediate":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      case "advanced":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
    }
  }

  const isWordAppropriateForUser = () => {
    const levels = ["beginner", "intermediate", "advanced"]
    const userLevelIndex = levels.indexOf(userLevel)
    const wordLevelIndex = levels.indexOf(level)
    return wordLevelIndex <= userLevelIndex + 1
  }

  const getTranslation = (word: string) => {
    // This would be replaced with actual translation logic
    // For now, we'll use a simple example
    const translations: Record<string, string> = {
      hello: "hola",
      world: "mundo",
      book: "libro",
      read: "leer",
    }
    return translations[word.toLowerCase()] || "Translation not available"
  }

  return (
    <Card
      className={cn(
        "absolute z-50 w-64 shadow-lg",
        !isWordAppropriateForUser() && "border-2 border-amber-500"
      )}
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
      }}
    >
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{word}</h3>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-medium",
              getLevelColor(level)
            )}
          >
            {level}
          </span>
        </div>
        <div className="mt-2 flex justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
          >
            Close
          </Button>
          {isWordAppropriateForUser() && (
            <Button
              size="sm"
              onClick={handleAddToVocabulary}
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add to Vocabulary"}
            </Button>
          )}
        </div>
        <div className="space-y-2">
          <div className="text-sm">
            <span className="font-medium">Translation:</span>{" "}
            {getTranslation(word)}
          </div>
          {level !== userLevel && (
            <div className="text-xs italic">
              This word is {level} level, but you are at {userLevel} level
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 