"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"

interface Category {
  id: string
  name: string
  slug: string
  description: string
  book_count: number
}

export function CategoriesClient() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true)
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select(`
            *,
            book_count: books(count)
          `)
          .order('name')

        if (categoriesError) throw categoriesError
        setCategories(categoriesData || [])
      } catch (err) {
        console.error('Error fetching categories:', err)
        setError('Failed to load categories. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-amber-50 to-white dark:from-gray-900 dark:to-gray-950">
        <SiteHeader />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            <div className="h-4 w-96 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mt-2" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="space-y-2">
                  <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                </CardHeader>
              </Card>
            ))}
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-amber-50 to-white dark:from-gray-900 dark:to-gray-950">
        <SiteHeader />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-10">
            <p className="text-red-500">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Try Again
            </Button>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-amber-50 to-white dark:from-gray-900 dark:to-gray-950">
        <SiteHeader />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-10">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
              No categories found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Check back later for new categories.
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
          <h1 className="text-3xl font-bold text-[#5D4B35]">Categories</h1>
          <p className="text-[#7D6E56] mt-2">Browse books by category</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Link href={`/categories/${category.slug}`}>
                <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg border-amber-200 dark:border-amber-800/40 dark:bg-gray-900 h-full">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-[#5D4B35]">
                      {category.name}
                    </CardTitle>
                    {category.description && (
                      <p className="text-sm text-[#7D6E56] mt-2">
                        {category.description}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <Badge className="bg-[#E6D7B8] text-[#5D4B35] hover:bg-[#D29E64] hover:text-white">
                      {category.book_count} books
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
} 