"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Book {
  id: number
  title: string
  slug: string
  cover_image: string
  author: {
    name: string
  }
  category: {
    name: string
  }
}

interface RecommendedBooksProps {
  books: Book[]
}

export function RecommendedBooks({ books }: RecommendedBooksProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScrollButtons = () => {
    if (!containerRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  const scrollLeft = () => {
    if (!containerRef.current) return
    containerRef.current.scrollBy({ left: -300, behavior: "smooth" })
  }

  const scrollRight = () => {
    if (!containerRef.current) return
    containerRef.current.scrollBy({ left: 300, behavior: "smooth" })
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  if (books.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-lg border border-gold-200 dark:border-gray-800"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gold-800 dark:text-gold-200">پیشنهاد برای شما</h2>
        <Link href="/library">
          <Button variant="ghost" className="text-gold-400 hover:text-gold-500 dark:hover:text-gold-300">
            مشاهده همه
            <ChevronLeft className="mr-1 h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="relative">
        <div
          className="flex overflow-x-auto scrollbar-hide gap-6 pb-4 -mx-2 px-2"
          ref={containerRef}
          onScroll={checkScrollButtons}
        >
          <motion.div className="flex gap-6" variants={container} initial="hidden" animate="show">
            {books.map((book, index) => (
              <motion.div
                key={book.id}
                variants={item}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex-shrink-0 w-[160px]"
              >
                <Link href={`/books/${book.slug}`} className="block group">
                  <div className="relative aspect-[2/3] mb-3">
                    <div className="absolute inset-0 bg-gradient-to-br from-gold-300 to-gold-400 rounded-2xl blur-md opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <div className="relative h-full overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                      <Image
                        src={book.cover_image || "/placeholder.svg?height=300&width=200"}
                        alt={book.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </div>
                  <h3 className="font-bold text-gold-800 dark:text-gold-200 line-clamp-1 group-hover:text-gold-400 transition-colors text-sm">
                    {book.title}
                  </h3>
                  <p className="text-xs text-gold-700 dark:text-gold-300 line-clamp-1">{book.author.name}</p>
                  <div className="mt-2">
                    <Badge
                      variant="outline"
                      className="text-xs border-gold-200 dark:border-gray-700 text-gold-700 dark:text-gold-300"
                    >
                      {book.category?.name || "دسته‌بندی نشده"}
                    </Badge>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {canScrollLeft && (
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/3 -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-900/90 border-gold-200 dark:border-gray-700 text-gold-800 dark:text-gold-200 hover:bg-gold-100/50 dark:hover:bg-gray-800 hover:text-gold-800 dark:hover:text-gold-200 rounded-full shadow-md h-8 w-8"
            onClick={scrollLeft}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}

        {canScrollRight && (
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/3 -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-900/90 border-gold-200 dark:border-gray-700 text-gold-800 dark:text-gold-200 hover:bg-gold-100/50 dark:hover:bg-gray-800 hover:text-gold-800 dark:hover:text-gold-200 rounded-full shadow-md h-8 w-8"
            onClick={scrollRight}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>
    </motion.div>
  )
}
