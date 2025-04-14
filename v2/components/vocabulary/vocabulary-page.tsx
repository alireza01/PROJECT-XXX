"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { prisma } from "@/v2/lib/db"

interface VocabularyItem {
  id: string
  word: string
  meaning: string
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
  createdAt: Date
}

export default function VocabularyPage() {
  const [words, setWords] = useState<VocabularyItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchWords = async () => {
    try {
      const response = await fetch("/api/vocabulary")
      const data = await response.json()
      setWords(data)
    } catch (error) {
      toast.error("Failed to fetch vocabulary")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">واژگان</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {words.map((word) => (
          <Card key={word.id}>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-2">{word.word}</h3>
              <p className="text-gray-600 dark:text-gray-400">{word.meaning}</p>
              <div className="mt-2">
                <span className="text-sm text-gray-500">سطح: {word.level}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 