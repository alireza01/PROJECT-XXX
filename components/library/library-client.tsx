"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { BookGrid } from "./book-grid"
import { CategoryFilter } from "./category-filter"
import { SearchBar } from "./search-bar"
import { Pagination } from "./pagination"
import { Book } from "@/types/book"
import { getBooks } from "@/lib/data"
import { Skeleton } from "@/components/ui/skeleton"

const ITEMS_PER_PAGE = 12

export function LibraryClient() {
  const searchParams = useSearchParams()
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [error, setError] = useState<string | null>(null)

  const page = Number(searchParams.get("page")) || 1
  const category = searchParams.get("category") || "all"
  const search = searchParams.get("search") || ""

  useEffect(() => {
    async function fetchBooks() {
      try {
        setLoading(true)
        const { books: fetchedBooks, total } = await getBooks({
          page,
          category: category === "all" ? undefined : category,
          search: search || undefined,
          limit: ITEMS_PER_PAGE,
        })
        setBooks(fetchedBooks)
        setTotalPages(Math.ceil(total / ITEMS_PER_PAGE))
      } catch (err) {
        console.error("Error fetching books:", err)
        setError("Failed to load books. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [page, category, search])

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <SearchBar />
        <CategoryFilter />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[3/4] w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-lg font-semibold">No books found</h3>
          <p className="text-muted-foreground">
            {search
              ? "No books match your search criteria."
              : category !== "all"
              ? "No books found in this category."
              : "No books available at the moment."}
          </p>
        </div>
      ) : (
        <>
          <BookGrid books={books} />
          <Pagination currentPage={page} totalPages={totalPages} />
        </>
      )}
    </div>
  )
} 