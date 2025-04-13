import { Metadata } from "next"
import { CategoryDetailClient } from "@/components/categories/category-detail-client"

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // In a real app, you would fetch the category data here
  // For now, we'll use a placeholder
  return {
    title: `Category | Online Book Reading`,
    description: `Browse books in this category`,
  }
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  return <CategoryDetailClient slug={params.slug} />
} 