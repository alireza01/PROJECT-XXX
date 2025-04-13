"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

interface RelatedBooksProps {
  id: string;
}

export function RelatedBooks({ id }: RelatedBooksProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (!containerRef.current) return
    containerRef.current.scrollBy({ left: -300, behavior: "smooth" })
  }

  const scrollRight = () => {
    if (!containerRef.current) return
    containerRef.current.scrollBy({ left: 300, behavior: "smooth" })
  }

  // Mock data for related books - in a real app, this would be fetched from the backend
  const books = [
    {
      id: 1,
      title: "تفکر سریع و کند",
      slug: "thinking-fast-and-slow",
      author: "دنیل کانمن",
      cover: "/placeholder.svg?height=300&width=200",
      rating: 4.6,
      price: "۲۳,۰۰۰ تومان",
    },
    {
      id: 2,
      title: "انسان در جستجوی معنا",
      slug: "mans-search-for-meaning",
      author: "ویکتور فرانکل",
      cover: "/placeholder.svg?height=300&width=200",
      rating: 4.9,
      price: "۲۰,۰۰۰ تومان",
    },
    {
      id: 3,
      title: "خرد مالی",
      slug: "the-psychology-of-money",
      author: "مورگان هاوزل",
      cover: "/placeholder.svg?height=300&width=200",
      rating: 4.5,
      price: "۱۷,۰۰۰ تومان",
    },
    {
      id: 4,
      title: "هنر ظریف بی‌خیالی",
      slug: "the-subtle-art-of-not-giving-a-fuck",
      author: "مارک منسون",
      cover: "/placeholder.svg?height=300&width=200",
      rating: 4.4,
      price: "۱۸,۰۰۰ تومان",
    },
    {
      id: 5,
      title: "چهار اثر از فلورانس",
      slug: "the-four-agreements",
      author: "فلورانس اسکاول شین",
      cover: "/placeholder.svg?height=300&width=200",
      rating: 4.3,
      price: "۱۹,۰۰۰ تومان",
    },
  ]

  return (
    <section className="py-12 px-4 bg-[#F8F3E9]">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-[#5D4B35]">کتاب‌های مرتبط</h2>
          <p className="text-[#7D6E56] mt-2">کتاب‌های مشابه که ممکن است به آن‌ها علاقه‌مند باشید</p>
        </motion.div>

        <div className="relative">
          <div className="flex overflow-x-auto scrollbar-hide gap-6 pb-6 -mx-4 px-4" ref={containerRef}>
            {books.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex-shrink-0 w-[160px] sm:w-[200px]"
              >
                <Link href={`/books/${book.slug}`} className="block group">
                  <div className="relative aspect-[2/3] mb-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#E6B980] to-[#D29E64] rounded-3xl blur-md opacity-20 group-hover:opacity-30 transition-opacity" />

                    <div className="relative h-full overflow-hidden rounded-3xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                      <Image
                        src={book.cover || "/placeholder.svg"}
                        alt={book.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      <div className="absolute bottom-3 right-3 bg-white/90 rounded-full px-2 py-1 flex items-center shadow-md">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 ml-1" />
                        <span className="text-xs font-medium text-[#5D4B35]">{book.rating}</span>
                      </div>
                    </div>
                  </div>

                  <h3 className="font-bold text-[#5D4B35] line-clamp-1 group-hover:text-[#D29E64] transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-sm text-[#7D6E56] line-clamp-1 mb-1">{book.author}</p>
                  <p className="text-sm font-bold text-[#D29E64]">{book.price}</p>
                </Link>
              </motion.div>
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 border-[#E6D7B8] text-[#5D4B35] hover:bg-[#E6D7B8]/50 hover:text-[#5D4B35] rounded-full shadow-md h-10 w-10"
            onClick={scrollLeft}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 border-[#E6D7B8] text-[#5D4B35] hover:bg-[#E6D7B8]/50 hover:text-[#5D4B35] rounded-full shadow-md h-10 w-10"
            onClick={scrollRight}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </Button>
        </div>
      </div>
    </section>
  )
}
