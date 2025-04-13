// @/app/library/page.tsx
import { Metadata } from "next"
import { LibraryClient } from "@/components/library/library-client"

export const metadata: Metadata = {
  title: "Library | Online Book Reading",
  description: "Browse our collection of books",
}

interface LibraryPageProps {
  searchParams: {
    q?: string
    category?: string
    level?: string
    sort?: string
    page?: string
  }
}

export default function LibraryPage({ searchParams }: LibraryPageProps) {
  return <LibraryClient searchParams={searchParams} />
}