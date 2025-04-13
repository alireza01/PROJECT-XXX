"use client"

import * as React from "react"
import { BookText } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Category {
  id: number
  name: string
  slug: string
}

interface CategoryIcons {
  [key: string]: React.ReactElement
}

interface CategoryTabsProps {
  categories: Category[]
  activeCategory: string
  onCategoryChange: (value: string) => void
  categoryIcons: CategoryIcons
}

export function CategoryTabs({ categories, activeCategory, onCategoryChange, categoryIcons }: CategoryTabsProps) {
  return (
    <Tabs value={activeCategory} onValueChange={onCategoryChange} className="w-full md:w-auto">
      <TabsList className="bg-white/50 dark:bg-gray-900/50 p-1 rounded-full h-auto flex-wrap">
        <TabsTrigger
          value="all"
          className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-300 data-[state=active]:to-gold-400 data-[state=active]:text-white"
        >
          {categoryIcons.all}
          همه
        </TabsTrigger>

        {categories.map((category) => (
          <TabsTrigger
            key={category.slug}
            value={category.slug}
            className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-300 data-[state=active]:to-gold-400 data-[state=active]:text-white"
          >
            {categoryIcons[category.slug] || <BookText className="h-4 w-4 ml-2" />}
            {category.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
} 