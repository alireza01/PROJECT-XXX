import { BookListSkeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="h-8 w-48 bg-gold-100 dark:bg-gray-800 animate-pulse rounded-md" />
          <div className="h-4 w-96 bg-gold-100 dark:bg-gray-800 animate-pulse rounded-md" />
        </div>
        <BookListSkeleton />
      </div>
    </div>
  )
} 