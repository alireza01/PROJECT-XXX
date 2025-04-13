"use client"

import { motion } from "framer-motion"
import { X, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface WordTooltipProps {
  word: string
  meaning: string
  explanation: string
  level: string
  position: { x: number; y: number }
  onClose: () => void
  isDarkMode?: boolean
}

export function WordTooltip({
  word,
  meaning,
  explanation,
  level,
  position,
  onClose,
  isDarkMode = false,
}: WordTooltipProps) {
  const levelColors = {
    beginner: isDarkMode
      ? "bg-gray-800 text-gold-300 border-gold-300/30"
      : "bg-gold-300/20 text-gold-400 border-gold-300",
    intermediate: isDarkMode
      ? "bg-gray-800 text-gold-400 border-gold-400/30"
      : "bg-gold-400/20 text-gold-500 border-gold-400",
    advanced: isDarkMode
      ? "bg-gray-800 text-gold-500 border-gold-500/30"
      : "bg-gold-500/20 text-gold-600 border-gold-500",
  }

  const levelText = {
    beginner: "مبتدی",
    intermediate: "متوسط",
    advanced: "پیشرفته",
  }

  const playPronunciation = () => {
    // Implementation for playing pronunciation
    console.log(`Playing pronunciation for: ${word}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className={`absolute z-30 ${
        isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gold-200"
      } rounded-2xl shadow-2xl border p-4 w-72`}
      style={{
        left: `${position.x}px`,
        top: `${position.y + 10}px`,
        transform: "translateX(-50%)",
      }}
    >
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45 border-t border-l border-gold-200 dark:border-gray-800 bg-white dark:bg-gray-900"></div>

      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <h3 className={`font-bold text-lg ${isDarkMode ? "text-gold-50" : "text-gold-800"}`}>{word}</h3>
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 rounded-full ${
              isDarkMode
                ? "text-gold-400 hover:bg-gray-800 hover:text-gold-400"
                : "text-gold-400 hover:bg-gold-100/50 hover:text-gold-400"
            }`}
            onClick={playPronunciation}
          >
            <Volume2 className="h-4 w-4" />
          </Button>
        </div>
        <Badge variant="outline" className={levelColors[level as keyof typeof levelColors]}>
          {levelText[level as keyof typeof levelText]}
        </Badge>
        <Button
          variant="ghost"
          size="icon"
          className={`h-6 w-6 -mt-1 -mr-1 rounded-full ${
            isDarkMode
              ? "text-gold-50 hover:bg-gray-800 hover:text-gold-50"
              : "text-gold-800 hover:bg-gold-100/50 hover:text-gold-800"
          }`}
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <div>
          <p className={`font-semibold ${isDarkMode ? "text-gold-50/70" : "text-gold-700"}`}>معنی:</p>
          <p className={isDarkMode ? "text-gold-50" : "text-gold-800"}>{meaning}</p>
        </div>

        <div>
          <p className={`font-semibold ${isDarkMode ? "text-gold-50/70" : "text-gold-700"}`}>توضیحات:</p>
          <p className={`text-sm ${isDarkMode ? "text-gold-50/70" : "text-gold-700"}`}>{explanation}</p>
        </div>

        <div className={`pt-2 border-t ${isDarkMode ? "border-gray-800" : "border-gold-200"} flex justify-between`}>
          <Button
            variant="ghost"
            size="sm"
            className={`text-xs ${
              isDarkMode
                ? "text-gold-400 hover:bg-gray-800 hover:text-gold-400"
                : "text-gold-400 hover:bg-gold-100/50 hover:text-gold-400"
            }`}
          >
            افزودن به کارت‌های مرور
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`text-xs ${
              isDarkMode
                ? "text-gold-400 hover:bg-gray-800 hover:text-gold-400"
                : "text-gold-400 hover:bg-gold-100/50 hover:text-gold-400"
            }`}
          >
            مثال‌های بیشتر
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
