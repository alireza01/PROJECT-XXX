"use client"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useAnimation } from "framer-motion"
import Button from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { getTrendingBooks } from '@/lib/data'

type Book = {
  id: string;
  title: string;
  slug: string;
  coverImage: string | null;
  rating: number | null;
  author: {
    id: string;
    name: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  isFeatured?: boolean;
  discountPercentage?: number;
  price?: number;
}

export function TrendingBooks() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const controls = useAnimation()

  useEffect(() => {
    async function fetchTrendingBooks() {
      try {
        const trendingBooks = await getTrendingBooks(6)
        setBooks(trendingBooks)
      } catch (error) {
        console.error('Error fetching trending books:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrendingBooks()
  }, [])

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-400"></div>
      </div>
    )
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No trending books found.</p>
      </div>
    )
  }

  return (
    <section className="py-16 px-4 bg-white dark:bg-gray-950">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-2xl md:text-3xl font-bold text-gold-800 dark:text-gold-200"
          >
            جدید و پرطرفدار
          </motion.h2>

          <Link href="/library">
            <Button
              className="text-gold-400 hover:bg-gold-100/50 dark:hover:bg-gray-800 hover:text-gold-500 dark:hover:text-gold-300"
            >
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
            {books.map((book) => (
              <motion.div
                key={book.id}
                initial="hidden"
                animate={controls}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: 0.1 * parseInt(book.id),
                      duration: 0.5,
                      ease: "easeOut",
                    },
                  },
                }}
                className="flex-shrink-0 w-[160px] sm:w-[200px]"
              >
                <Link href={`/books/${book.slug}`} className="block group">
                  <div className="relative aspect-[2/3] mb-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-gold-300 to-gold-400 rounded-3xl blur-md opacity-20 group-hover:opacity-30 transition-opacity"></div>

                    <div className="relative h-full overflow-hidden rounded-3xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                      <Image
                        src={book.coverImage || '/images/book-placeholder.jpg'}
                        alt={book.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      {book.isFeatured && (
                        <Badge className="absolute top-3 right-3 bg-gold-400/90 hover:bg-gold-400 text-white border-none">
                          پرفروش
                        </Badge>
                      )}

                      {book.discountPercentage && book.discountPercentage > 0 && (
                        <Badge className="absolute top-3 left-3 bg-red-500/90 hover:bg-red-500 text-white border-none">
                          {book.discountPercentage}% تخفیف
                        </Badge>
                      )}

                      <div className="absolute bottom-3 right-3 bg-white/90 dark:bg-gray-800/90 rounded-full px-2 py-1 flex items-center shadow-md">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 ml-1" />
                        <span className="text-xs font-medium text-gold-800 dark:text-gold-200">
                          {book.rating?.toFixed(1) || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <h3 className="font-bold text-gold-800 dark:text-gold-200 line-clamp-1 group-hover:text-gold-400 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gold-700 dark:text-gold-300 line-clamp-1 mb-1">{book.author.name}</p>
                  <p className="text-sm font-bold text-gold-400">
                    {new Intl.NumberFormat('fa-IR', {
                      style: 'currency',
                      currency: 'IRR'
                    }).format(book.price || 0)}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>

          {canScrollLeft && (
            <Button
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-900/90 border-gold-200 dark:border-gray-700 text-gold-800 dark:text-gold-200 hover:bg-gold-100/50 dark:hover:bg-gray-800 hover:text-gold-800 dark:hover:text-gold-200 rounded-full shadow-md h-10 w-10"
              onClick={scrollLeft}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}

          {canScrollRight && (
            <Button
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-900/90 border-gold-200 dark:border-gray-700 text-gold-800 dark:text-gold-200 hover:bg-gold-100/50 dark:hover:bg-gray-800 hover:text-gold-800 dark:hover:text-gold-200 rounded-full shadow-md h-10 w-10"
              onClick={scrollRight}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
