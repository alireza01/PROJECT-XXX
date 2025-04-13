import { NextResponse } from "next/server"
import { auth } from "@/v2/lib/auth"
import { prisma } from "@/v2/lib/db"
import { getBookPageWithWords } from "@/v2/lib/db-actions"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const pageNumber = Number(searchParams.get("page") || "1")

    // Get book details
    const book = await prisma.book.findUnique({
      where: { id: params.id },
      include: {
        author: true,
      },
    })

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    // Get current user
    const session = await auth()
    const userId = session?.user?.id || "anonymous"

    // Get user progress if logged in
    let currentPage = pageNumber
    if (session?.user) {
      const progress = await prisma.userProgress.findUnique({
        where: {
          userId_bookId: {
            userId: session.user.id,
            bookId: book.id,
          },
        },
      })

      if (progress && !searchParams.has("page")) {
        currentPage = progress.currentPage
      }
    }

    // Get page content with words
    let pageContent
    try {
      pageContent = await getBookPageWithWords(book.id, currentPage)
    } catch (error) {
      // If page not found, default to page 1
      if (currentPage !== 1) {
        pageContent = await getBookPageWithWords(book.id, 1)
        currentPage = 1
      } else {
        // If still not found, create a default page
        pageContent = {
          pageNumber: 1,
          content: "محتوای این صفحه در دسترس نیست.",
          words: [],
        }
      }
    }

    // Check if book is bookmarked
    let isBookmarked = false
    if (session?.user) {
      const bookmark = await prisma.bookmark.findUnique({
        where: {
          userId_bookId: {
            userId: session.user.id,
            bookId: book.id,
          },
        },
      })
      isBookmarked = !!bookmark
    }

    return NextResponse.json({
      book: {
        id: book.id,
        title: book.title,
        author: book.author.name,
        totalPages: book.pageCount,
      },
      currentPage,
      pageContent,
      isBookmarked,
      userId,
    })
  } catch (error) {
    console.error("Error fetching book page:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
