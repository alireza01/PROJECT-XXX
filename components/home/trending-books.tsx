"use client"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useAnimation } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { formatPrice } from "@/lib/utils"

interface Book {
  id: number
  title: string
  slug: string
  author: {
    name: string
  }
  cover_image: string
  price: number
  discount_percentage: number
  is_featured: boolean
  rating: number
}

export function TrendingBooks() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const controls = useAnimation()

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from("books")
          .select(`
            id,
            title,
            slug,
            cover_image,
            price,
            discount_percentage,
            is_featured,
            author:author_id(name),
            rating
          `)
          .eq("is_featured", true)
          .order("rating", { ascending: false })
          .limit(10)

        if (error) {
          console.error("Error fetching books:", error.message, error.details, error.hint)
          return
        }

        if (!data) {
          console.error("No data returned from Supabase")
          return
        }

        // Transform the data to match our Book interface
        const transformedBooks = data.map(book => ({
          ...book,
          author: {
            name: book.author[0]?.name || 'Unknown Author'
          }
        }))

        setBooks(transformedBooks)
      } catch (err) {
        console.error("Unexpected error fetching books:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBooks()
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

  // Mock data for trending books (fallback)
  const mockBooks = [
    {
      id: 1,
      title: "اتم‌های عادت",
      slug: "atomic-habits",
      author: { name: "جیمز کلیر" },
      cover_image: "/placeholder.svg?height=400&width=250",
      price: 190000,
      discount_percentage: 0,
      is_featured: true,
      rating: 4.8,
    },
    {
      id: 2,
      title: "کشتن مرغ مقلد",
      slug: "to-kill-a-mockingbird",
      author: { name: "هارپر لی" },
      cover_image: "/placeholder.svg?height=400&width=250",
      price: 240000,
      discount_percentage: 10,
      is_featured: false,
      rating: 4.9,
    },
    {
      id: 3,
      title: "هری پاتر و سنگ جادو",
      slug: "harry-potter",
      author: { name: "جی.کی. رولینگ" },
      cover_image: "/placeholder.svg?height=400&width=250",
      price: 220000,
      discount_percentage: 0,
      is_featured: true,
      rating: 4.7,
    },
    {
      id: 4,
      title: "1984",
      slug: "1984",
      author: { name: "جورج اورول" },
      cover_image: "/placeholder.svg?height=400&width=250",
      price: 210000,
      discount_percentage: 5,
      is_featured: false,
      rating: 4.6,
    },
    {
      id: 5,
      title: "صد سال تنهایی",
      slug: "one-hundred-years-of-solitude",
      author: { name: "گابریل گارسیا مارکز" },
      cover_image: "/placeholder.svg?height=400&width=250",
      price: 260000,
      discount_percentage: 0,
      is_featured: false,
      rating: 4.8,
    },
    {
      id: 6,
      title: "خرد مالی",
      slug: "the-psychology-of-money",
      author: { name: "مورگان هاوزل" },
      cover_image: "/placeholder.svg?height=400&width=250",
      price: 170000,
      discount_percentage: 15,
      is_featured: true,
      rating: 4.5,
    },
  ]

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
              variant="ghost"
              className="text-gold-400 hover:bg-gold-100/50 dark:hover:bg-gray-800 hover:text-gold-500 dark:hover:text-gold-300"
            >
              مشاهده همه
              <ChevronLeft className="mr-1 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="relative">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="flex-shrink-0 w-full animate-pulse">
                  <div className="aspect-[2/3] bg-gold-100 dark:bg-gray-800 rounded-3xl mb-4"></div>
                  <div className="h-4 bg-gold-100 dark:bg-gray-800 rounded mb-2 w-3/4"></div>
                  <div className="h-3 bg-gold-100 dark:bg-gray-800 rounded mb-2 w-1/2"></div>
                  <div className="h-3 bg-gold-100 dark:bg-gray-800 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div
                className="flex overflow-x-auto scrollbar-hide gap-6 pb-6 -mx-4 px-4"
                ref={containerRef}
                onScroll={checkScrollButtons}
              >
                {books.map((book, index) => (
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
                          delay: index * 0.1,
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
                            src={book.cover_image || "/placeholder.svg?height=400&width=250"}
                            alt={book.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />

                          {book.is_featured && (
                            <Badge className="absolute top-3 right-3 bg-gold-400/90 hover:bg-gold-400 text-white border-none">
                              پرفروش
                            </Badge>
                          )}

                          {book.discount_percentage > 0 && (
                            <Badge className="absolute top-3 left-3 bg-red-500/90 hover:bg-red-500 text-white border-none">
                              {book.discount_percentage}٪ تخفیف
                            </Badge>
                          )}

                          <div className="absolute bottom-3 right-3 bg-white/90 dark:bg-gray-800/90 rounded-full px-2 py-1 flex items-center shadow-md">
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 ml-1" />
                            <span className="text-xs font-medium text-gold-800 dark:text-gold-200">
                              {book.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <h3 className="font-bold text-gold-800 dark:text-gold-200 line-clamp-1 group-hover:text-gold-400 transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-sm text-gold-700 dark:text-gold-300 line-clamp-1 mb-1">{book.author.name}</p>
                      <p className="text-sm font-bold text-gold-400">{formatPrice(book.price)}</p>
                    </Link>
                  </motion.div>
                ))}
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
            </>
          )}
        </div>
      </div>
    </section>
  )
}
