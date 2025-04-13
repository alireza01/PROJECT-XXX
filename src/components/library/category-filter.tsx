"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Category } from "@/types/category"

interface CategoryFilterProps {
  categories: Category[]
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get("category") || "all"

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "all") {
      params.delete("category")
    } else {
      params.set("category", value)
    }
    params.set("page", "1") // Reset to first page when changing category
    router.push(`/library?${params.toString()}`)
  }

  return (
    <Select value={currentCategory} onValueChange={handleCategoryChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Categories</SelectItem>
        {categories.map((category) => (
          <SelectItem key={category.id} value={category.slug}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
} 