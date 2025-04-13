import { redirect } from "next/navigation"
import { auth } from "@/v2/lib/auth"
import { prisma } from "@/v2/lib/db"
import { VocabularyPage } from "@/v2/components/vocabulary/vocabulary-page"

export default async function VocabularyPageRoute() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/login?redirect=/vocabulary")
  }

  // Get user's words
  const userWords = await prisma.userWordProgress.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      word: {
        include: {
          books: {
            include: {
              book: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                  coverUrl: true,
                },
              },
            },
            take: 1,
          },
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  })

  // Format words for the component
  const words = userWords.map((progress) => ({
    id: progress.word.id,
    word: progress.word.word,
    meaning: progress.word.meaning,
    level: progress.word.level,
    example: progress.word.example || undefined,
    pronunciation: progress.word.pronunciation || undefined,
    category: progress.word.category || undefined,
    status: progress.status,
    lastPracticed: progress.updatedAt,
    book: progress.word.books[0]?.book || undefined,
  }))

  // Get stats
  const totalWords = words.length
  const totalLearning = words.filter((word) => word.status === "LEARNING").length
  const totalKnown = words.filter((word) => word.status === "KNOWN").length

  return (
    <VocabularyPage
      initialWords={words}
      totalWords={totalWords}
      totalLearning={totalLearning}
      totalKnown={totalKnown}
    />
  )
}
