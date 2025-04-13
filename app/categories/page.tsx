import { Metadata } from "next"
import { CategoriesClient } from "@/components/categories/categories-client"

export const metadata: Metadata = {
  title: "Categories | Online Book Reading",
  description: "Browse our collection of books by category",
}

export default function CategoriesPage() {
  return <CategoriesClient />
} 