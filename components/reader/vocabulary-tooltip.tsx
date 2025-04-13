"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { VocabularyLevel } from "@/types"

interface VocabularyTooltipProps {
  word: string
  level: VocabularyLevel
  position: { x: number; y: number }
  onClose: () => void
  userLevel: VocabularyLevel
}

export function VocabularyTooltip({
  word,
  level,
  position,
  onClose,
  userLevel,
}: VocabularyTooltipProps) {
  const getLevelColor = (level: VocabularyLevel) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
    }
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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className={`fixed z-50 p-4 rounded-lg shadow-lg ${getLevelColor(level)}`}
        style={{
          left: position.x,
          top: position.y + 10,
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold">{word}</span>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-2">
          <div className="text-sm">
            <span className="font-medium">Level:</span>{" "}
            <span className="capitalize">{level}</span>
          </div>
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
      </motion.div>
    </AnimatePresence>
  )
} 