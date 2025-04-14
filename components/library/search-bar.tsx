"use client"

import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import useDebounce from "@/hooks/use-debounce"
import { useEffect, useState } from "react"

interface SearchBarProps {
  searchParams: {
    q?: string
    category?: string
    level?: string
    sort?: string
    page?: string
  }
}

export function SearchBar({ searchParams }: SearchBarProps) {
  const router = useRouter()
  const [search, setSearch] = useState(searchParams.q || "")
  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    const params = new URLSearchParams()
    if (debouncedSearch) {
      params.set("q", debouncedSearch)
    }
    if (searchParams.category) {
      params.set("category", searchParams.category)
    }
    if (searchParams.level) {
      params.set("level", searchParams.level)
    }
    if (searchParams.sort) {
      params.set("sort", searchParams.sort)
    }
    params.set("page", "1")
    router.push(`/library?${params.toString()}`)
  }, [debouncedSearch, router, searchParams])

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search books..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="pl-9"
      />
    </div>
  )
} 