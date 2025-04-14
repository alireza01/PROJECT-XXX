"use client"

import React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { VocabularyStats as VocabularyStatsType } from "@/types/index"

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
            <span className="text-sm font-medium">{currentLevel}</span>
          </div>
          <div className="space-y-4">
            {stats.map((stat) => (
              <div key={stat.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{stat.label}</span>
                  <span className="text-sm font-medium">{stat.value}</span>
                </div>
                <Progress value={stat.percentage} className={`bg-${stat.color}-100`} />
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