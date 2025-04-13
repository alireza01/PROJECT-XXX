"use client"

import React, { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ArrowRight, BookOpen, Headphones, Award } from "lucide-react"

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  }

  const floatingAnimation = {
    y: ["-5%", "5%"],
    transition: {
      y: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    },
  }

  return (
    <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-amber-50/80 via-white to-amber-50/30 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10"></div>
      <div className="container mx-auto relative">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="lg:w-1/2 text-center lg:text-right"
          >
            <motion.h1
              variants={item}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-amber-800 dark:text-amber-200"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500 animate-gradient">
                مطالعه هوشمند
              </span>{" "}
              برای یادگیری بهتر
            </motion.h1>

            <motion.p
              variants={item}
              className="text-lg text-amber-700/90 dark:text-amber-100/90 mb-8 max-w-2xl mx-auto lg:mx-0"
            >
              با کتاب‌خوان، تجربه مطالعه خود را به سطح جدیدی ببرید. امکانات پیشرفته، کتاب‌های متنوع و ابزارهای یادگیری
              هوشمند، همه در یک پلتفرم.
            </motion.p>

            <motion.div variants={item} className="relative mb-8 max-w-md mx-auto lg:mx-0">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-amber-400" />
              <Input
                placeholder="جستجوی کتاب، نویسنده یا موضوع..."
                className="pl-4 pr-10 py-6 rounded-full border-amber-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm focus-visible:ring-amber-400 shadow-lg hover:shadow-xl transition-all duration-300"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              />
            </motion.div>

            <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                شروع رایگان
                <ArrowRight className="mr-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-amber-400 text-amber-800 dark:text-amber-200 hover:bg-amber-200/50 dark:hover:bg-gray-800 hover:text-amber-800 dark:hover:text-amber-200 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                مشاهده کتاب‌ها
              </Button>
            </motion.div>

            <motion.div variants={item} className="flex flex-wrap justify-center lg:justify-start gap-6 mt-10">
              <div className="flex items-center group">
                <div className="bg-amber-100 dark:bg-gray-800 p-2 rounded-full mr-3 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="h-5 w-5 text-amber-400" />
                </div>
                <div className="text-right">
                  <p className="font-bold text-amber-800 dark:text-amber-200">+۱۰۰۰</p>
                  <p className="text-sm text-amber-700 dark:text-amber-300">کتاب</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="bg-amber-100 dark:bg-gray-800 p-2 rounded-full mr-3">
                  <Headphones className="h-5 w-5 text-amber-400" />
                </div>
                <div className="text-right">
                  <p className="font-bold text-amber-800 dark:text-amber-200">+۵۰۰</p>
                  <p className="text-sm text-amber-700 dark:text-amber-300">کتاب صوتی</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="bg-amber-100 dark:bg-gray-800 p-2 rounded-full mr-3">
                  <Award className="h-5 w-5 text-amber-400" />
                </div>
                <div className="text-right">
                  <p className="font-bold text-amber-800 dark:text-amber-200">+۱۰K</p>
                  <p className="text-sm text-amber-700 dark:text-amber-300">کاربر فعال</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:w-1/2 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-300 to-amber-400 rounded-3xl blur-3xl opacity-20 dark:opacity-10 transform -rotate-6"></div>

            <div className="relative z-10">
              <motion.div animate={floatingAnimation} className="relative mx-auto lg:ml-auto lg:mr-0 max-w-md">
                <Image
                  src="/placeholder.svg?height=600&width=400"
                  alt="کتاب‌خوان"
                  width={400}
                  height={600}
                  className="rounded-3xl shadow-2xl border-8 border-white dark:border-gray-800"
                />

                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl border border-amber-200 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-100 dark:bg-gray-700 p-2 rounded-full">
                      <BookOpen className="h-6 w-6 text-amber-400" />
                    </div>
                    <div>
                      <p className="font-bold text-amber-800 dark:text-amber-200">اتم‌های عادت</p>
                      <p className="text-sm text-amber-700 dark:text-amber-300">جیمز کلیر</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="absolute -top-6 -left-6 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl border border-amber-200 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-100 dark:bg-gray-700 p-2 rounded-full">
                      <Headphones className="h-6 w-6 text-amber-400" />
                    </div>
                    <div>
                      <p className="font-bold text-amber-800 dark:text-amber-200">کتاب صوتی</p>
                      <p className="text-sm text-amber-700 dark:text-amber-300">+۵۰۰ عنوان</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
