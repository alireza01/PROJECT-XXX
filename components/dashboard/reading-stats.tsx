"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flame, Calendar, Clock, TrendingUp } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface ReadingStatsProps {
  userId: string
}

export function ReadingStats({ userId }: ReadingStatsProps) {
  const [streak, setStreak] = useState(0)
  const [totalBooks, setTotalBooks] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [readingTime, setReadingTime] = useState("0 دقیقه")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true)
      try {
        // Fetch user progress for stats
        const { data: progressData } = await supabase
          .from("user_progress")
          .select(`
            current_page,
            book:book_id(page_count)
          `)
          .eq("user_id", userId)

        // Calculate total books
        setTotalBooks(progressData?.length || 0)

        // Calculate total pages read
        const pages = progressData?.reduce((sum, item) => sum + (item.current_page || 0), 0) || 0
        setTotalPages(pages)

        // Calculate reading time (rough estimate: 2 minutes per page)
        const minutes = pages * 2
        if (minutes < 60) {
          setReadingTime(`${minutes} دقیقه`)
        } else {
          const hours = Math.floor(minutes / 60)
          const remainingMinutes = minutes % 60
          setReadingTime(`${hours} ساعت${remainingMinutes > 0 ? ` و ${remainingMinutes} دقیقه` : ""}`)
        }

        // Calculate streak (mock data for now)
        setStreak(Math.floor(Math.random() * 10) + 1) // Random streak between 1-10
      } catch (error) {
        console.error("Error fetching reading stats:", error)
        // Set fallback data
        setTotalBooks(0)
        setTotalPages(0)
        setReadingTime("0 دقیقه")
        setStreak(0)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [userId])

  const statsItems = [
    {
      title: "روزهای متوالی",
      value: streak,
      icon: <Flame className="h-5 w-5 text-orange-500" />,
      color: "bg-orange-100 dark:bg-orange-900/20",
    },
    {
      title: "کتاب‌های مطالعه شده",
      value: totalBooks,
      icon: <Calendar className="h-5 w-5 text-blue-500" />,
      color: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "صفحات خوانده شده",
      value: totalPages,
      icon: <TrendingUp className="h-5 w-5 text-green-500" />,
      color: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "زمان مطالعه",
      value: readingTime,
      icon: <Clock className="h-5 w-5 text-purple-500" />,
      color: "bg-purple-100 dark:bg-purple-900/20",
      isText: true,
    },
  ]

  return (
    <Card className="border-gold-200 dark:border-gray-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-gold-800 dark:text-gold-200">آمار مطالعه</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex items-center gap-4 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-gold-100 dark:bg-gray-800"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gold-100 dark:bg-gray-800 rounded w-1/3"></div>
                  <div className="h-6 bg-gold-100 dark:bg-gray-800 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {statsItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex items-center gap-4"
              >
                <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center`}>
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm text-gold-700 dark:text-gold-300">{item.title}</p>
                  <p className="text-xl font-bold text-gold-800 dark:text-gold-200">
                    {item.isText ? item.value : item.value.toLocaleString("fa-IR")}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
