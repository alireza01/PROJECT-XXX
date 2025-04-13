import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import Link from "next/link"

interface PageProps {
  params: { slug: string }
}

export default function BookPage({ params }: PageProps) {
  const { slug } = params

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        <div className="md:col-span-1">
          <Card className="overflow-hidden border-gold-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <div className="aspect-[2/3] relative">
              <img
                src={`/placeholder.svg?height=450&width=300`}
                alt="Book cover"
                className="object-cover w-full h-full"
              />
            </div>
            <CardContent className="p-4">
              <div className="flex flex-col gap-2">
                <Link href={`/books/${slug}/read`}>
                  <Button className="w-full bg-gradient-to-r from-gold-300 to-gold-400 hover:opacity-90 text-white">شروع مطالعه</Button>
                </Link>
                <Button variant="outline" className="w-full border-gold-300 dark:border-gray-600 text-gold-800 dark:text-gold-200 hover:bg-gold-100 dark:hover:bg-gray-800">
                  افزودن به کتابخانه
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl font-bold mb-2 text-gold-800 dark:text-gold-200"
          >
            {slug.replace(/-/g, " ")}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gold-700 dark:text-gold-300 mb-4"
          >
            نویسنده: نام نویسنده
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            <Badge className="bg-gold-100 text-gold-800 dark:bg-gray-800 dark:text-gold-200">داستان</Badge>
            <Badge className="bg-gold-100 text-gold-800 dark:bg-gray-800 dark:text-gold-200">رمان</Badge>
            <Badge className="bg-gold-100 text-gold-800 dark:bg-gray-800 dark:text-gold-200">معاصر</Badge>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-6"
          >
            <h2 className="text-xl font-semibold mb-2 text-gold-800 dark:text-gold-200">درباره کتاب</h2>
            <p className="text-gold-700 dark:text-gold-300">
              این یک متن نمونه برای توضیحات کتاب است. در اینجا خلاصه‌ای از داستان و محتوای کتاب ارائه می‌شود. این متن به
              خواننده کمک می‌کند تا با موضوع کتاب آشنا شود و تصمیم بگیرد که آیا این کتاب مناسب مطالعه است یا خیر. لورم
              ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="grid grid-cols-2 gap-4 mb-6"
          >
            <div>
              <h3 className="font-medium text-gold-800 dark:text-gold-200">ژانر</h3>
              <p className="text-gold-700 dark:text-gold-300">داستان، رمان</p>
            </div>
            <div>
              <h3 className="font-medium text-gold-800 dark:text-gold-200">تعداد صفحات</h3>
              <p className="text-gold-700 dark:text-gold-300">250</p>
            </div>
            <div>
              <h3 className="font-medium text-gold-800 dark:text-gold-200">سال انتشار</h3>
              <p className="text-gold-700 dark:text-gold-300">1402</p>
            </div>
            <div>
              <h3 className="font-medium text-gold-800 dark:text-gold-200">سطح دشواری</h3>
              <p className="text-gold-700 dark:text-gold-300">متوسط</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-gold-800 dark:text-gold-200">کتاب‌های مرتبط</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <motion.div 
                  key={item}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  className="aspect-[2/3] relative rounded-md overflow-hidden shadow-md"
                >
                  <img
                    src={`/placeholder.svg?height=300&width=200`}
                    alt={`Related book ${item}`}
                    className="object-cover w-full h-full"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
} 