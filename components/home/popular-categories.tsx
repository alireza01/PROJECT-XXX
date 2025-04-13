"use client"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, BookText, Lightbulb, Briefcase, Heart, Music } from "lucide-react"

export function PopularCategories() {
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
      level: "متوسط",
      rating: 4.8,
    },
    {
      id: 2,
      title: "کشتن مرغ مقلد",
      author: "هارپر لی",
      cover: "/placeholder.svg?height=300&width=200",
      category: "fiction",
      level: "پیشرفته",
      rating: 4.9,
    },
    {
      id: 3,
      title: "هری پاتر و سنگ جادو",
      author: "جی.کی. رولینگ",
      cover: "/placeholder.svg?height=300&width=200",
      category: "fiction",
      level: "مبتدی",
      rating: 4.7,
    },
    {
      id: 4,
      title: "پدر پولدار، پدر فقیر",
      author: "رابرت کیوساکی",
      cover: "/placeholder.svg?height=300&width=200",
      category: "business",
      level: "متوسط",
      rating: 4.6,
    },
    {
      id: 5,
      title: "غرور و تعصب",
      author: "جین آستین",
      cover: "/placeholder.svg?height=300&width=200",
      category: "romance",
      level: "پیشرفته",
      rating: 4.8,
    },
    {
      id: 6,
      title: "استیو جابز",
      author: "والتر ایزاکسون",
      cover: "/placeholder.svg?height=300&width=200",
      category: "biography",
      level: "متوسط",
      rating: 4.9,
    },
    {
      id: 7,
      title: "1984",
      author: "جورج اورول",
      cover: "/placeholder.svg?height=300&width=200",
      category: "fiction",
      level: "پیشرفته",
      rating: 4.7,
    },
    {
      id: 8,
      title: "تفکر سریع و کند",
      author: "دنیل کانمن",
      cover: "/placeholder.svg?height=300&width=200",
      category: "self-help",
      level: "پیشرفته",
      rating: 4.6,
    },
  ]

  return (
    <section className="py-20 px-4 bg-[#F5F3FF] dark:bg-gray-800">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            دسته‌بندی‌های محبوب
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            کتاب‌های مورد علاقه خود را بر اساس دسته‌بندی پیدا کنید
          </motion.p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="flex flex-wrap justify-center mb-8 bg-white/50 dark:bg-gray-900/50 p-1 rounded-full mx-auto max-w-2xl">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="rounded-full data-[state=active]:bg-[#6949FF] data-[state=active]:text-white"
              >
                <span className="flex items-center gap-2">
                  {category.icon}
                  {category.label}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {allBooks
                  .filter((book) => category.id === "all" || book.category === category.id)
                  .map((book) => (
                    <motion.div
                      key={book.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                      whileHover={{ y: -10 }}
                    >
                      <Link href={`/books/${book.id}`}>
                        <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                          <CardContent className="p-0">
                            <div className="relative">
                              <Image
                                src={book.cover || "/placeholder.svg"}
                                alt={book.title}
                                width={200}
                                height={300}
                                className="w-full h-auto object-cover aspect-[2/3]"
                              />
                              <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full px-2 py-1 flex items-center shadow-md">
                                <svg className="w-3 h-3 text-yellow-500 mr-1 fill-current" viewBox="0 0 24 24">
                                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                </svg>
                                <span className="text-xs font-medium">{book.rating}</span>
                              </div>
                              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                <h3 className="text-white font-bold text-lg leading-tight">{book.title}</h3>
                                <p className="text-white/80 text-sm">{book.author}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="text-center mt-12">
          <Link
            href="/library"
            className="inline-flex items-center justify-center px-6 py-3 bg-[#6949FF] text-white rounded-full hover:bg-[#5A3FD6] transition-colors"
          >
            مشاهده همه کتاب‌ها
          </Link>
        </div>
      </div>
    </section>
  )
}
