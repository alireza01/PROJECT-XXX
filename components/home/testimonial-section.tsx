"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function TestimonialSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  const testimonials = [
    {
      name: "سارا محمدی",
      role: "دانشجوی زبان انگلیسی",
      avatar: "/placeholder.svg?height=100&width=100",
      content:
        "این پلتفرم به من کمک کرد تا بتوانم کتاب‌های انگلیسی را با سرعت بیشتری مطالعه کنم. دیگر نیازی به مراجعه مداوم به دیکشنری ندارم و این باعث شده لذت مطالعه چندین برابر شود. معنی کلمات با توضیحات کامل و مثال‌های کاربردی ارائه می‌شود که به درک بهتر متن کمک می‌کند.",
    },
    {
      name: "امیر حسینی",
      role: "مترجم و مدرس زبان",
      avatar: "/placeholder.svg?height=100&width=100",
      content:
        "به عنوان یک مدرس زبان، این پلتفرم را به تمام دانشجویانم معرفی می‌کنم. ترجمه‌های دقیق و با حفظ مفهوم اصلی، یکی از نقاط قوت این سیستم است که به یادگیری واقعی زبان کمک می‌کند نه فقط حفظ کردن معانی.",
    },
    {
      name: "مریم رضایی",
      role: "دانش‌آموز دبیرستانی",
      avatar: "/placeholder.svg?height=100&width=100",
      content:
        "قبلاً از خواندن کتاب‌های انگلیسی می‌ترسیدم، اما با این برنامه توانستم اولین کتاب انگلیسی‌ام را تا آخر بخوانم! رنگ‌بندی کلمات بر اساس سطح دشواری خیلی هوشمندانه است و به من کمک می‌کند تا پیشرفتم را ببینم.",
    },
  ]

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-20 px-4 bg-white dark:bg-gray-900">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            نظرات کاربران
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            ببینید دیگران درباره تجربه استفاده از پلتفرم ما چه می‌گویند
          </motion.p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute top-10 left-0 -z-10">
            <Quote className="h-24 w-24 text-[#F0E6FF] dark:text-[#6949FF]/20" />
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl"
              >
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="md:w-1/4 flex flex-col items-center text-center">
                    <Avatar className="w-20 h-20 border-4 border-[#F0E6FF] dark:border-[#6949FF]/20">
                      <AvatarImage
                        src={testimonials[activeIndex].avatar || "/placeholder.svg"}
                        alt={testimonials[activeIndex].name}
                      />
                      <AvatarFallback className="bg-[#6949FF] text-white">
                        {testimonials[activeIndex].name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold mt-4">{testimonials[activeIndex].name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonials[activeIndex].role}</p>
                  </div>

                  <div className="md:w-3/4">
                    <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                      {testimonials[activeIndex].content}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center mt-8 gap-4">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-[#6949FF] text-[#6949FF] hover:bg-[#6949FF]/10 hover:text-[#6949FF]"
                onClick={prevTestimonial}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>

              <div className="flex items-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                      index === activeIndex ? "bg-[#6949FF]" : "bg-gray-300 dark:bg-gray-700"
                    }`}
                    onClick={() => setActiveIndex(index)}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-[#6949FF] text-[#6949FF] hover:bg-[#6949FF]/10 hover:text-[#6949FF]"
                onClick={nextTestimonial}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
