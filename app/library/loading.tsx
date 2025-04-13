import { BookListSkeleton } from "@/components/ui/skeleton"

export default function LibraryLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-4">
            <div className="h-8 w-48 bg-gold-100 dark:bg-gray-800 animate-pulse rounded-md" />
            <div className="h-4 w-96 bg-gold-100 dark:bg-gray-800 animate-pulse rounded-md" />
          </div>
          <div className="h-10 w-32 bg-gold-100 dark:bg-gray-800 animate-pulse rounded-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 space-y-4">
            <div className="h-8 w-full bg-gold-100 dark:bg-gray-800 animate-pulse rounded-md" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-full bg-gold-100 dark:bg-gray-800 animate-pulse rounded-md"
                />
              ))}
            </div>
          </div>
          <div className="md:col-span-3">
            <BookListSkeleton />
          </div>
        </div>
      </div>
    </div>
  )
} 