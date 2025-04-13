"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react"

interface Book {
  id: number
  book: {
    id: number
    title: string
    slug: string
    cover_image: string
    page_count: number
    author: {
      name: string
    }
  }
  current_page: number
  completion_percentage: number
  last_read_at: string
}

interface CurrentlyReadingProps {
  books: Book[]
}

export function CurrentlyReading({ books }: CurrentlyReadingProps) {
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
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-lg border border-gold-200 dark:border-gray-800 text-center"
      >
        <div className="flex flex-col items-center justify-center py-12">
          <div className="bg-gold-100 dark:bg-gray-800 p-4 rounded-full mb-4">
            <BookOpen className="h-10 w-10 text-gold-400" />
          </div>
          <h3 className="text-xl font-bold text-gold-800 dark:text-gold-200 mb-2">هنوز کتابی را شروع نکرده‌اید</h3>
          <p className="text-gold-700 dark:text-gold-300 mb-6 max-w-md">
            برای شروع مطالعه، یک کتاب از کتابخانه انتخاب کنید و سفر یادگیری خود را آغاز کنید.
          </p>
          <Button asChild className="bg-gradient-to-r from-gold-300 to-gold-400 hover:opacity-90 text-white">
            <Link href="/library">
              مشاهده کتابخانه
              <ChevronLeft className="mr-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gold-800 dark:text-gold-200">در حال مطالعه</h2>
        <Link href="/library">
          <Button variant="ghost" className="text-gold-400 hover:text-gold-500 dark:hover:text-gold-300">
            مشاهده همه
            <ChevronLeft className="mr-1 h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="relative">
        <div
          className="flex overflow-x-auto scrollbar-hide gap-6 pb-6 -mx-4 px-4"
          ref={containerRef}
          onScroll={checkScrollButtons}
        >
          <motion.div className="flex gap-6" variants={container} initial="hidden" animate="show">
            {books.map((item, index) => (
              <motion.div
                key={item.id}
                variants={item}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex-shrink-0 w-[280px]"
              >
                <Link href={`/books/${item.book.slug}/read?page=${item.current_page}`}>
                  <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 shadow-lg border border-gold-200 dark:border-gray-800 h-full transition-transform hover:scale-[1.02] hover:shadow-xl">
                    <div className="flex gap-4">
                      <div className="relative w-20 h-28 flex-shrink-0">
                        <Image
                          src={item.book.cover_image || "/placeholder.svg?height=300&width=200"}
                          alt={item.book.title}
                          fill
                          className="object-cover rounded-xl"
                        />
                      </div>
                      <div className="flex flex-col justify-between flex-1">
                        <div>
                          <h3 className="font-bold text-gold-800 dark:text-gold-200 line-clamp-1">{item.book.title}</h3>
                          <p className="text-sm text-gold-700 dark:text-gold-300 mb-2">{item.book.author.name}</p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gold-700 dark:text-gold-300">پیشرفت</span>
                            <span className="text-gold-400 font-medium">{Math.round(item.completion_percentage)}٪</span>
                          </div>
                          <Progress value={item.completion_percentage} className="h-2 bg-gold-100 dark:bg-gray-800">
                            <div className="h-full bg-gradient-to-r from-gold-300 to-gold-400 rounded-full" />
                          </Progress>
                          <div className="flex justify-between text-xs text-gold-700 dark:text-gold-300">
                            <span>صفحه {item.current_page}</span>
                            <span>از {item.book.page_count} صفحه</span>
                          </div>
                        </div>
                      </div>
                    </div>
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
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-900/90 border-gold-200 dark:border-gray-700 text-gold-800 dark:text-gold-200 hover:bg-gold-100/50 dark:hover:bg-gray-800 hover:text-gold-800 dark:hover:text-gold-200 rounded-full shadow-md h-10 w-10"
            onClick={scrollLeft}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        )}

        {canScrollRight && (
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-900/90 border-gold-200 dark:border-gray-700 text-gold-800 dark:text-gold-200 hover:bg-gold-100/50 dark:hover:bg-gray-800 hover:text-gold-800 dark:hover:text-gold-200 rounded-full shadow-md h-10 w-10"
            onClick={scrollRight}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
      </div>
    </motion.div>
  )
}
