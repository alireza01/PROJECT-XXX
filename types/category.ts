export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface CategoryFilterProps {
  categories: Category[]
  selectedCategory?: string
  onCategoryChange: (categoryId: string) => void
} 