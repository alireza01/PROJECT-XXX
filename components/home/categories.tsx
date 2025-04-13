"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, BookText, Lightbulb, Briefcase, Heart, Music } from "lucide-react"

export function Categories() {
  const [activeCategory, setActiveCategory] = useState("all")

  const categories = [
    { id: "all", label: "همه", icon: <BookOpen className="h-4 w-4" /> },
    { id: "fiction", label: "داستانی", icon: <BookText className="h-4 w-4" /> },
    { id: "self-help", label: "توسعه فردی", icon: <Lightbulb className="h-4 w-4" /> },
    { id: "business", label: "کسب و کار", icon: <Briefcase className="h-4 w-4" /> },
    { id: "romance", label: "عاشقانه", icon: <Heart className="h-4 w-4" /> },
    { id: "biography", label: "زندگینامه", icon: <Music className="h-4 w-4" /> },
  ]

  const allBooks = [
    {
      id: 1,
      title: "اتم‌های عادت",
      author: "جیمز کلیر",
      cover: "/placeholder.svg?height=300&width=200",
      category: "self-help",
      rating: 4.8,
    },
    {
      id: 2,
      title: "کشتن مرغ مقلد",
      author: "هارپر لی",
      cover: "/placeholder.svg?height=300&width=200",
      category: "fiction",
      rating: 4.9,
    },
    {
      id: 3,
      title: "هری پاتر و سنگ جادو",
      author: "جی.کی. رولینگ",
      cover: "/placeholder.svg?height=300&width=200",
      category: "fiction",
      rating: 4.7,
    },
    {
      id: 4,
      title: "پدر پولدار، پدر فقیر",
      author: "رابرت کیوساکی",
      cover: "/placeholder.svg?height=300&width=200",
      category: "business",
      rating: 4.6,
    },
    {
      id: 5,
      title: "غرور و تعصب",
      author: "جین آستین",
      cover: "/placeholder.svg?height=300&width=200",
      category: "romance",
      rating: 4.8,
    },
    {
      id: 6,
      title: "استیو جابز",
      author: "والتر ایزاکسون",
      cover: "/placeholder.svg?height=300&width=200",
      category: "biography",
      rating: 4.9,
    },
    {
      id: 7,
      title: "1984",
      author: "جورج اورول",
      cover: "/placeholder.svg?height=300&width=200",
      category: "fiction",
      rating: 4.7,
    },
    {
      id: 8,
      title: "تفکر سریع و کند",
      author: "دنیل کانمن",
      cover: "/placeholder.svg?height=300&width=200",
      category: "self-help",
      rating: 4.6,
    },
  ]

  return (
    <section className="py-16 px-4 bg-[#F0E6D2]">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-[#5D4B35] mb-4">دسته‌بندی‌های محبوب</h2>
          <p className="text-[#7D6E56] max-w-2xl mx-auto">کتاب‌های مورد علاقه خود را بر اساس دسته‌بندی پیدا کنید</p>
        </motion.div>

        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveCategory}>
          <TabsList className="flex flex-wrap justify-center mb-10 bg-white/50 p-1.5 rounded-full mx-auto max-w-3xl">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#E6B980] data-[state=active]:to-[#D29E64] data-[state=active]:text-white"
              >
                <span className="flex items-center gap-2">
                  {category.icon}
                  {category.label}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {allBooks
              .filter((book) => activeCategory === "all" || book.category === activeCategory)
              .map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  whileHover={{ y: -10 }}
                >
                  <Link href={`/books/${book.id}`} className="block group">
                    <div className="relative aspect-[2/3] mb-4">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#E6B980] to-[#D29E64] rounded-3xl blur-md opacity-20 group-hover:opacity-30 transition-opacity" />

                      <div className="relative h-full overflow-hidden rounded-3xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                        <Image
                          src={book.cover || "/placeholder.svg"}
                          alt={book.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </div>

                    <h3 className="font-bold text-[#5D4B35] line-clamp-1 group-hover:text-[#D29E64] transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-sm text-[#7D6E56] line-clamp-1">{book.author}</p>
                  </Link>
                </motion.div>
              ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/categories">
              <Button className="bg-gradient-to-r from-[#E6B980] to-[#D29E64] hover:opacity-90 text-white rounded-full shadow-md">
                مشاهده همه دسته‌بندی‌ها
              </Button>
            </Link>
          </div>
        </Tabs>
      </div>
    </section>
  )
}
