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
}

export function WordTooltip({ word, meaning, explanation, level, position, onClose }: WordTooltipProps) {
  const levelColors = {
    beginner: "bg-green-100 text-green-800 border-green-300",
    intermediate: "bg-blue-100 text-blue-800 border-blue-300",
    advanced: "bg-purple-100 text-purple-800 border-purple-300",
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
      className="absolute z-30 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 w-72"
      style={{
        left: `${position.x}px`,
        top: `${position.y + 10}px`,
        transform: "translateX(-50%)",
      }}
    >
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45 bg-white dark:bg-gray-800 border-t border-l border-gray-200 dark:border-gray-700"></div>

      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-lg">{word}</h3>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={playPronunciation}>
            <Volume2 className="h-4 w-4" />
          </Button>
        </div>
        <Badge variant="outline" className={levelColors[level as keyof typeof levelColors]}>
          {levelText[level as keyof typeof levelText]}
        </Badge>
        <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1 -mr-1" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <div>
          <p className="font-semibold text-gray-700 dark:text-gray-300">معنی:</p>
          <p>{meaning}</p>
        </div>

        <div>
          <p className="font-semibold text-gray-700 dark:text-gray-300">توضیحات:</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{explanation}</p>
        </div>

        <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between">
          <Button variant="ghost" size="sm" className="text-xs">
            افزودن به کارت‌های مرور
          </Button>
          <Button variant="ghost" size="sm" className="text-xs">
            مثال‌های بیشتر
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
