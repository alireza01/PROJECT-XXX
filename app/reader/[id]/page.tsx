"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { BookReader } from "@/components/reader/book-reader"
import { PageControls } from "@/components/reader/page-controls"
import { ReadingProgress } from "@/components/reader/reading-progress"
import { Book } from "@/types"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function ReaderPage() {
  const { id } = useParams()
  const { data: session } = useSession()
  const router = useRouter()
  const [book, setBook] = useState<Book | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin")
      return
    }

    const fetchBook = async () => {
      try {
        const response = await fetch(`/api/books/${id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch book")
        }
        const data = await response.json()
        setBook(data)
        setIsLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        setIsLoading(false)
      }
    }

    fetchBook()
  }, [id, session, router])

  const handlePageChange = async (newPage: number) => {
    if (!book || newPage < 1 || newPage > book.pages) return

    setCurrentPage(newPage)
    
    // Update reading progress in the database
    try {
      await fetch("/api/reading-progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId: id,
          currentPage: newPage,
        }),
      })
    } catch (err) {
      console.error("Failed to update reading progress:", err)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Book not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <ReadingProgress currentPage={currentPage} totalPages={book.pages} />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{book.title}</h1>
          <p className="text-gray-600 dark:text-gray-400">by {book.author}</p>
        </div>

        <BookReader
          book={book}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />

        <PageControls
          currentPage={currentPage}
          totalPages={book.pages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
} 