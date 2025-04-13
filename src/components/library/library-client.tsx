"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { BookGrid } from "@/components/library/book-grid"
import { CategoryFilter } from "@/components/library/category-filter"
import { SearchBar } from "@/components/library/search-bar"
import { Pagination } from "@/components/library/pagination"
import { Book } from "@/types/book"
import { Category } from "@/types/category"
import { getBooks, getCategories } from "@/lib/data"
import { Skeleton } from "@/components/ui/skeleton"

const ITEMS_PER_PAGE = 12

interface LibraryClientProps {
  searchParams: {
    q?: string
    category?: string
    level?: string
    sort?: string
    page?: string
  }
}

export function LibraryClient({ searchParams }: LibraryClientProps) {
  const [books, setBooks] = useState<Book[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [error, setError] = useState<string | null>(null)

  const page = Number(searchParams.page) || 1
  const category = searchParams.category || "all"
  const search = searchParams.q || ""

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const [booksData, categoriesData] = await Promise.all([
          getBooks({
            page,
            category: category === "all" ? undefined : category,
            search: search || undefined,
            limit: ITEMS_PER_PAGE,
          }),
          getCategories(),
        ])
        setBooks(booksData.books)
        setTotalPages(Math.ceil(booksData.total / ITEMS_PER_PAGE))
        setCategories(categoriesData)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
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
        <CategoryFilter categories={categories} />
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