"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, SlidersHorizontal, BookOpen, BookText, Lightbulb, Briefcase, Heart, Music } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { SearchForm } from "./search-form"
import { CategoryTabs } from "./category-tabs"
import { categoryIcons } from "@/lib/constants/category-icons"

interface Category {
  id: number
  name: string
  slug: string
}

interface LibraryHeaderProps {
  categories: Category[]
}

export function LibraryHeader({ categories }: LibraryHeaderProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "all")
  const [sortOrder, setSortOrder] = useState(searchParams.get("sort") || "newest")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams()
    if (searchQuery) params.set("q", searchQuery)
    if (activeCategory !== "all") params.set("category", activeCategory)
    if (sortOrder !== "newest") params.set("sort", sortOrder)

    router.push(`/library?${params.toString()}`)
  }

  const handleCategoryChange = (value: string) => {
    setActiveCategory(value)

    const params = new URLSearchParams(searchParams.toString())
    if (value === "all") {
      params.delete("category")
    } else {
      params.set("category", value)
    }

    router.push(`/library?${params.toString()}`)
  }

  const handleSortChange = (value: string) => {
    setSortOrder(value)

    const params = new URLSearchParams(searchParams.toString())
    if (value === "newest") {
      params.delete("sort")
    } else {
      params.set("sort", value)
    }

    router.push(`/library?${params.toString()}`)
  }

  return (
    <div className="bg-gradient-to-b from-gold-100 to-gold-50 dark:from-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gold-800 dark:text-gold-200 mb-4">کتابخانه</h1>
          <p className="text-gold-700 dark:text-gold-300 max-w-2xl mx-auto">
            از میان صدها کتاب انگلیسی با ترجمه هوشمند، کتاب مورد نظر خود را پیدا کنید
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="max-w-3xl mx-auto mb-8"
        >
          <SearchForm 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSubmit={handleSearch}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8"
        >
          <CategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
            categoryIcons={categoryIcons}
          />

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Select value={sortOrder} onValueChange={handleSortChange}>
              <SelectTrigger className="w-full md:w-[180px] border-gold-200 dark:border-gray-700 focus:ring-gold-400">
                <SelectValue placeholder="مرتب‌سازی" />
              </SelectTrigger>
              <SelectContent className="border-gold-200 dark:border-gray-700">
                <SelectItem value="newest">جدیدترین</SelectItem>
                <SelectItem value="popular">محبوب‌ترین</SelectItem>
                <SelectItem value="rating">بیشترین امتیاز</SelectItem>
                <SelectItem value="price-asc">قیمت: کم به زیاد</SelectItem>
                <SelectItem value="price-desc">قیمت: زیاد به کم</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon" className="border-gold-200 dark:border-gray-700">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
