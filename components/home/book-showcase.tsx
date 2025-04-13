"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function BookShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)

  const books = [
    {
      title: "اتم‌های عادت",
      author: "جیمز کلیر",
      cover: "/placeholder.svg?height=400&width=250",
      level: "متوسط",
      category: "توسعه فردی",
      rating: 4.8,
      price: "۱۹,۰۰۰ تومان",
    },
    {
      title: "کشتن مرغ مقلد",
      author: "هارپر لی",
      cover: "/placeholder.svg?height=400&width=250",
      level: "پیشرفته",
      category: "ادبیات کلاسیک",
      rating: 4.9,
      price: "۲۴,۰۰۰ تومان",
    },
    {
      title: "هری پاتر و سنگ جادو",
      author: "جی.کی. رولینگ",
      cover: "/placeholder.svg?height=400&width=250",
      level: "مبتدی",
      category: "فانتزی",
      rating: 4.7,
      price: "۲۲,۰۰۰ تومان",
    },
  ]

  const nextBook = () => {
    setActiveIndex((prev) => (prev + 1) % books.length)
  }

  const prevBook = () => {
    setActiveIndex((prev) => (prev - 1 + books.length) % books.length)
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-[#F5F3FF] dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            کتاب‌های محبوب
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            از میان صدها کتاب موجود، بهترین‌ها را برای تقویت مهارت زبان انگلیسی خود انتخاب کنید
          </motion.p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="flex justify-center items-center">
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-0 z-10 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 rounded-full shadow-md"
              onClick={prevBook}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            <div className="relative h-[500px] w-full flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col md:flex-row items-center gap-8 md:gap-16"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#6949FF] to-[#C961DE] rounded-2xl blur-2xl opacity-20"></div>
                    <motion.div
                      className="relative"
                      whileHover={{ y: -10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Image
                        src={books[activeIndex].cover || "/placeholder.svg"}
                        alt={books[activeIndex].title}
                        width={250}
                        height={400}
                        className="rounded-2xl shadow-2xl"
                      />
                      <div className="absolute top-3 right-3 bg-white dark:bg-gray-800 rounded-full px-2 py-1 flex items-center shadow-md">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="text-xs font-medium">{books[activeIndex].rating}</span>
                      </div>
                    </motion.div>
                  </div>

                  <div className="text-center md:text-right max-w-md">
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                      <Badge
                        variant="secondary"
                        className="bg-[#F0E6FF] text-[#6949FF] hover:bg-[#E6D9FF] dark:bg-[#6949FF]/20 dark:text-[#A78BFF]"
                      >
                        {books[activeIndex].category}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-[#6949FF] text-[#6949FF] dark:border-[#A78BFF] dark:text-[#A78BFF]"
                      >
                        سطح {books[activeIndex].level}
                      </Badge>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold mb-2">{books[activeIndex].title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">نویسنده: {books[activeIndex].author}</p>

                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                      لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.
                      چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                      <Button className="bg-[#6949FF] hover:bg-[#5A3FD6]">شروع مطالعه رایگان</Button>
                      <div className="flex items-center justify-center md:justify-start">
                        <span className="text-lg font-bold text-[#6949FF] dark:text-[#A78BFF]">
                          {books[activeIndex].price}
                        </span>
                        <span className="mr-2 text-sm text-gray-500 dark:text-gray-400">خرید کامل</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 z-10 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 rounded-full shadow-md"
              onClick={nextBook}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </div>

          <div className="flex justify-center mt-8 gap-2">
            {books.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  index === activeIndex ? "bg-[#6949FF]" : "bg-gray-300 dark:bg-gray-700"
                }`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
