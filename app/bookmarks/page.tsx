import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { auth } from "@/v2/lib/auth"
import { prisma } from "@/v2/lib/db"
import { formatDate } from "@/v2/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bookmark, BookOpen } from "lucide-react"

export default async function BookmarksPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/login?redirect=/bookmarks")
  }

  // Get user's bookmarks
  const bookmarks = await prisma.bookmark.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      book: {
        include: {
          author: true,
          category: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-amber-900 dark:text-amber-300">کتاب‌های نشان‌شده</h1>
          <p className="text-amber-700/80 dark:text-amber-400/80">کتاب‌هایی که برای مطالعه بعدی نشان کرده‌اید</p>
        </div>
      </div>

      {bookmarks.length === 0 ? (
        <Card className="border-amber-200 dark:border-amber-800/40">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bookmark className="h-12 w-12 text-amber-400/50 dark:text-amber-700/50 mb-4" />
            <h2 className="text-xl font-medium text-amber-900 dark:text-amber-300 mb-2">هیچ کتابی نشان نشده است</h2>
            <p className="text-amber-700/80 dark:text-amber-400/80 mb-6 text-center max-w-md">
              با کلیک روی آیکون نشان در صفحه کتاب‌ها، آن‌ها را برای مطالعه بعدی نشان‌گذاری کنید.
            </p>
            <Button asChild>
              <Link href="/library">مشاهده کتابخانه</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((bookmark) => (
            <Card key={bookmark.id} className="border-amber-200 dark:border-amber-800/40 overflow-hidden">
              <div className="flex h-full">
                <div className="relative w-1/3 min-h-[220px]">
                  <Image
                    src={
                      bookmark.book.coverUrl ||
                      `/placeholder.svg?height=300&width=200&text=${encodeURIComponent(bookmark.book.title) || "/placeholder.svg"}`
                    }
                    alt={bookmark.book.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="w-2/3 p-4 flex flex-col">
                  <div>
                    <Link href={`/books/${bookmark.book.slug}`} className="hover:underline">
                      <h3 className="font-bold text-lg text-amber-900 dark:text-amber-300 line-clamp-2">
                        {bookmark.book.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-amber-700/80 dark:text-amber-400/80 mb-2">{bookmark.book.author.name}</p>
                    <p className="text-xs text-amber-700/60 dark:text-amber-400/60 mb-4">
                      نشان شده در {formatDate(bookmark.createdAt)}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 mb-4">
                      {bookmark.book.description}
                    </p>
                  </div>
                  <div className="mt-auto">
                    <Button size="sm" className="w-full" asChild>
                      <Link href={`/books/${bookmark.book.slug}/read`}>
                        <BookOpen className="h-4 w-4 ml-2" />
                        مطالعه
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
