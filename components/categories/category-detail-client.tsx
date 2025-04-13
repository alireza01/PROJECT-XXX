"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { BookGrid } from "@/components/library/book-grid"
import { supabase } from "@/lib/supabase/client"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { Pagination } from "@/components/ui/pagination"

interface Category {
  id: string
  name: string
  description: string
  total_books: number
}

interface CategoryDetailClientProps {
  slug: string
}

export function CategoryDetailClient({ slug }: CategoryDetailClientProps) {
  const searchParams = useSearchParams()
  const page = Number(searchParams.get('page')) || 1
  const [category, setCategory] = useState<Category | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const ITEMS_PER_PAGE = 12

  useEffect(() => {
    async function fetchCategory() {
      try {
        setLoading(true)
        // Fetch category details
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select(`
            *,
            total_books: books(count)
          `)
          .eq('slug', slug)
          .single()

        if (categoryError) throw categoryError
        
        if (categoryData) {
          setCategory({
            ...categoryData,
            total_books: categoryData.total_books || 0
          })
          setTotalPages(Math.ceil((categoryData.total_books || 0) / ITEMS_PER_PAGE))
        }
      } catch (err) {
        console.error('Error fetching category:', err)
        setError('Failed to load category. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchCategory()
  }, [slug])

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-amber-50 to-white dark:from-gray-900 dark:to-gray-950">
        <SiteHeader />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-4 w-96 bg-gray-200 dark:bg-gray-800 rounded" />
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  if (error || !category) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-amber-50 to-white dark:from-gray-900 dark:to-gray-950">
        <SiteHeader />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-10">
            <h1 className="text-2xl font-bold text-red-500">Category not found</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              The category you're looking for doesn't exist or there was an error loading it.
            </p>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-amber-50 to-white dark:from-gray-900 dark:to-gray-950">
      <SiteHeader />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#5D4B35]">{category.name}</h1>
          {category.description && (
            <p className="text-[#7D6E56] mt-2">{category.description}</p>
          )}
          <p className="text-[#7D6E56] mt-2">
            {category.total_books} {category.total_books === 1 ? 'book' : 'books'} in this category
          </p>
        </div>

        <BookGrid />

        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              baseUrl={`/categories/${slug}`}
            />
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  )
} 