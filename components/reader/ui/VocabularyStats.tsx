"use client"

import React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { VocabularyStats as VocabularyStatsType } from "@/types"

interface VocabularyStatsProps extends VocabularyStatsType {
  className?: string
}

export function VocabularyStats({
  totalWords,
  knownWords,
  learningWords,
  newWords,
  currentLevel,
  className
}: VocabularyStatsProps) {
  const stats = [
    {
      label: "Known Words",
      value: knownWords,
      percentage: (knownWords / totalWords) * 100,
      color: "green"
    },
    {
      label: "Learning Words",
      value: learningWords,
      percentage: (learningWords / totalWords) * 100,
      color: "yellow"
    },
    {
      label: "New Words",
      value: newWords,
      percentage: (newWords / totalWords) * 100,
      color: "blue"
    }
  ]

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="text-lg">Vocabulary Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Current Level</span>
            <span className="text-sm font-semibold capitalize">{currentLevel.toLowerCase()}</span>
          </div>
          <div className="space-y-4">
            {stats.map(({ label, value, percentage, color }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1">
                  <span className={cn("text-xs", `text-${color}-600`)}>{label}</span>
                  <span className="text-xs text-muted-foreground">{value}</span>
                </div>
                <Progress 
                  value={percentage} 
                  className={cn("h-2", `[&>div]:bg-${color}-500`)}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total Vocabulary</span>
            <span className="text-sm font-semibold">{totalWords} words</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 