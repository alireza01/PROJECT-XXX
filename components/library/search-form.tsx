"use client"

import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SearchFormProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export function SearchForm({ searchQuery, setSearchQuery, onSubmit }: SearchFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <div className="relative">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gold-400" />
        <Input
          placeholder="جستجوی کتاب، نویسنده یا موضوع..."
          className="pl-4 pr-10 py-6 text-lg rounded-full border-gold-200 dark:border-gray-700 focus-visible:ring-gold-400 shadow-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button
          type="submit"
          className="absolute left-1 top-1 bottom-1 bg-gradient-to-r from-gold-300 to-gold-400 hover:opacity-90 text-white rounded-full shadow-md"
        >
          جستجو
        </Button>
      </div>
    </form>
  )
} 