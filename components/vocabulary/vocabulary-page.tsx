import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Bookmark, CheckCircle2, Clock } from "lucide-react"

interface VocabularyWord {
  id: string
  word: string
  meaning: string
  level: string
  example?: string
  pronunciation?: string
  category?: string
  status: "LEARNING" | "KNOWN"
  lastPracticed: Date
  book?: {
    id: string
    title: string
    slug: string
    coverUrl: string
  }
}

interface VocabularyPageProps {
  initialWords: VocabularyWord[]
  totalWords: number
  totalLearning: number
  totalKnown: number
}

export function VocabularyPage({
  initialWords,
  totalWords,
  totalLearning,
  totalKnown,
}: VocabularyPageProps) {
  const [words] = useState<VocabularyWord[]>(initialWords)
  const [selectedWord, setSelectedWord] = useState<VocabularyWord | null>(null)

  const progressPercentage = totalWords > 0 ? (totalKnown / totalWords) * 100 : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-amber-900 dark:text-amber-300">واژگان</h1>
          <p className="text-amber-700/80 dark:text-amber-400/80">مدیریت و یادگیری واژگان</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 border-amber-200 dark:border-amber-800/40">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
              <Bookmark className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-amber-700/80 dark:text-amber-400/80">کل واژگان</p>
              <p className="text-2xl font-bold text-amber-900 dark:text-amber-300">{totalWords}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-amber-200 dark:border-amber-800/40">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
              <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-amber-700/80 dark:text-amber-400/80">در حال یادگیری</p>
              <p className="text-2xl font-bold text-amber-900 dark:text-amber-300">{totalLearning}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-amber-200 dark:border-amber-800/40">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-amber-700/80 dark:text-amber-400/80">یاد گرفته شده</p>
              <p className="text-2xl font-bold text-amber-900 dark:text-amber-300">{totalKnown}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="border-amber-200 dark:border-amber-800/40">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-300">پیشرفت یادگیری</h2>
            <span className="text-sm text-amber-700/80 dark:text-amber-400/80">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </Card>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {words.map((word) => (
          <Card
            key={word.id}
            className={`p-4 border-amber-200 dark:border-amber-800/40 cursor-pointer transition-colors ${
              selectedWord?.id === word.id
                ? "bg-amber-50 dark:bg-amber-900/20"
                : "hover:bg-amber-50/50 dark:hover:bg-amber-900/10"
            }`}
            onClick={() => setSelectedWord(word)}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg text-amber-900 dark:text-amber-300">{word.word}</h3>
                <p className="text-sm text-amber-700/80 dark:text-amber-400/80">{word.meaning}</p>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs ${
                  word.status === "KNOWN"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                    : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
                }`}
              >
                {word.status === "KNOWN" ? "یاد گرفته شده" : "در حال یادگیری"}
              </span>
            </div>
            {word.book && (
              <div className="mt-4 flex items-center gap-2 text-sm text-amber-700/60 dark:text-amber-400/60">
                <BookOpen className="h-4 w-4" />
                <span>{word.book.title}</span>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
} 