"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Settings, BookOpen, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"

interface PageProps {
  params: { slug: string }
}

export default function ReadBookPage({ params }: PageProps) {
  const { slug } = params
  const [fontSize, setFontSize] = useState(16)
  const [currentPage, setCurrentPage] = useState(1)
  const [bookmarked, setBookmarked] = useState(false)

  // Sample book content - in a real app, this would be fetched from an API
  const bookContent = `
    این یک متن نمونه برای نمایش محتوای کتاب ${slug.replace(/-/g, " ")} است. در یک برنامه واقعی، این متن از پایگاه داده یا API دریافت می‌شود.
    
    لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد.
    
    کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد.
  `

  const nextPage = () => {
    setCurrentPage((prev: number) => prev + 1)
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev: number) => prev - 1)
    }
  }

  const changeFontSize = (value: number[]) => {
    setFontSize(value[0])
  }

  const toggleBookmark = () => {
    setBookmarked((prev: boolean) => !prev)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gold-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Top navigation */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="border-b border-gold-200 dark:border-gray-700 p-4 flex justify-between items-center"
      >
        <Button variant="ghost" size="icon" onClick={prevPage} disabled={currentPage === 1} className="text-gold-800 dark:text-gold-200">
          <ChevronRight className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2 text-gold-800 dark:text-gold-200">
          <BookOpen className="h-5 w-5" />
          <span className="font-medium">
            {slug.replace(/-/g, " ")} - صفحه {currentPage}
          </span>
        </div>

        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={toggleBookmark} className="text-gold-800 dark:text-gold-200">
            <Bookmark className={`h-5 w-5 ${bookmarked ? "fill-current" : ""}`} />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gold-800 dark:text-gold-200">
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-900 border-gold-200 dark:border-gray-700">
              <div className="p-2">
                <p className="text-sm font-medium mb-2 text-gold-800 dark:text-gold-200">اندازه متن</p>
                <Slider 
                  defaultValue={[fontSize]} 
                  max={24} 
                  min={12} 
                  step={1} 
                  onValueChange={changeFontSize}
                  className="text-gold-500"
                />
              </div>
              <DropdownMenuItem className="text-gold-800 dark:text-gold-200 focus:bg-gold-100 dark:focus:bg-gray-800">تغییر فونت</DropdownMenuItem>
              <DropdownMenuItem className="text-gold-800 dark:text-gold-200 focus:bg-gold-100 dark:focus:bg-gray-800">حالت شب</DropdownMenuItem>
              <DropdownMenuItem className="text-gold-800 dark:text-gold-200 focus:bg-gold-100 dark:focus:bg-gray-800">نشانه‌گذاری</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.header>

      {/* Book content */}
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-1 p-4 md:p-8 max-w-3xl mx-auto"
      >
        <div className="prose prose-lg dark:prose-invert mx-auto" style={{ fontSize: `${fontSize}px` }}>
          {bookContent.split("\n").map((paragraph, index) => (
            <p key={index} className="mb-4 text-justify leading-relaxed text-gold-800 dark:text-gold-200">
              {paragraph}
            </p>
          ))}
        </div>
      </motion.main>

      {/* Bottom navigation */}
      <motion.footer 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="border-t border-gold-200 dark:border-gray-700 p-4 flex justify-between"
      >
        <Button 
          variant="outline" 
          onClick={prevPage} 
          disabled={currentPage === 1}
          className="border-gold-300 dark:border-gray-600 text-gold-800 dark:text-gold-200 hover:bg-gold-100 dark:hover:bg-gray-800"
        >
          <ChevronRight className="h-5 w-5 ml-2" />
          صفحه قبل
        </Button>

        <Button 
          onClick={nextPage}
          className="bg-gradient-to-r from-gold-300 to-gold-400 hover:opacity-90 text-white"
        >
          صفحه بعد
          <ChevronLeft className="h-5 w-5 mr-2" />
        </Button>
      </motion.footer>
    </div>
  )
}
