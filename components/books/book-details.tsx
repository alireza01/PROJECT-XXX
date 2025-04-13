"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Star, Share2, Bookmark, Heart, Award, Clock, BookText, Users } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { formatPrice } from "@/lib/utils"
import { useAuth } from "@/v2/hooks/use-auth"

interface BookDetailsProps {
  id: string
}

export function BookDetails({ id }: BookDetailsProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [book, setBook] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchBookDetails = async () => {
      setIsLoading(true)
      try {
        // Use the exported supabase instance from lib/supabase/client.ts
        // const supabase = createClient() // No need to create a new client

        // Fetch book details
        const { data: bookData, error: bookError } = await supabase
          .from("books")
          .select(`
            id,
            title,
            slug,
            description,
            cover_image,
            page_count,
            level,
            publish_date,
            language,
            price,
            discount_percentage,
            has_free_trial,
            free_pages,
            read_time,
            author:author_id(id, name),
            category:category_id(id, name)
          `)
          .eq("id", id)
          .single()

        if (bookError) throw bookError

        // Fetch reviews
        const { data: reviewsData, error: reviewsError } = await supabase
          .from("reviews")
          .select(`
            id,
            rating,
            comment,
            created_at,
            user:user_id(email)
          `)
          .eq("book_id", bookData?.id)
          .order("created_at", { ascending: false })
          .limit(5)

        if (reviewsError) throw reviewsError

        // Fetch tags
        const { data: tagsData, error: tagsError } = await supabase
          .from("book_tags")
          .select(`
            tag:tag_id(id, name)
          `)
          .eq("book_id", bookData?.id)

        if (tagsError) throw tagsError

        // Check if user has bookmarked this book
        if (user?.id) {
          const { data: bookmarkData } = await supabase
            .from("user_bookmarks")
            .select("id")
            .eq("book_id", bookData?.id)
            .eq("user_id", user.id)
            .single()

          setIsBookmarked(!!bookmarkData)

          // Check if user has liked this book
          const { data: likeData } = await supabase
            .from("user_likes")
            .select("id")
            .eq("book_id", bookData?.id)
            .eq("user_id", user.id)
            .single()

          setIsLiked(!!likeData)
        }

        // Calculate average rating
        const avgRating =
          reviewsData.length > 0
            ? reviewsData.reduce((sum: number, review: any) => sum + (review.rating || 0), 0) / reviewsData.length
            : 0

        // Format the book data
        setBook({
          ...bookData,
          tags: tagsData?.map((tag: any) => tag.tag.name) || [],
          rating: avgRating,
          reviewCount: reviewsData.length,
        })

        setReviews(reviewsData)
      } catch (error) {
        console.error("Error fetching book details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookDetails()
  }, [id, user])

  const handleBookmark = async () => {
    if (!user?.id) return

    try {
      // const supabase = createClient()

      if (isBookmarked) {
        // Remove bookmark
        await supabase.from("user_bookmarks").delete().eq("book_id", book?.id).eq("user_id", user.id)
      } else {
        // Add bookmark
        await supabase.from("user_bookmarks").insert({
          book_id: book?.id,
          user_id: user.id,
        })
      }

      setIsBookmarked(!isBookmarked)
    } catch (error) {
      console.error("Error toggling bookmark:", error)
    }
  }

  const handleLike = async () => {
    if (!user?.id) return

    try {
      // const supabase = createClient()

      if (isLiked) {
        // Remove like
        await supabase.from("user_likes").delete().eq("book_id", book?.id).eq("user_id", user.id)
      } else {
        // Add like
        await supabase.from("user_likes").insert({
          book_id: book?.id,
          user_id: user.id,
        })
      }

      setIsLiked(!isLiked)
    } catch (error) {
      console.error("Error toggling like:", error)
    }
  }

  return (
    <section className="py-12 px-4 bg-gradient-to-b from-gold-100 to-gold-50 dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          <div className="md:w-1/3 lg:w-1/4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative mx-auto md:mx-0 max-w-[250px]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gold-300 to-gold-400 rounded-3xl blur-xl opacity-20"></div>

              <motion.div whileHover={{ y: -10 }} transition={{ type: "spring", stiffness: 300 }} className="relative">
                <Image
                  src={book?.cover_image || "/placeholder.svg?height=500&width=350"}
                  alt={book?.title}
                  width={350}
                  height={500}
                  className="rounded-3xl shadow-2xl w-full h-auto"
                />
              </motion.div>

              <div className="flex justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="icon"
                  className={`rounded-full border-gold-200 dark:border-gray-700 ${
                    isBookmarked
                      ? "bg-gold-200/50 dark:bg-gray-800/50 text-gold-400 dark:text-gold-400 border-gold-400 dark:border-gold-400"
                      : "text-gold-800 dark:text-gold-200 hover:bg-gold-200/50 dark:hover:bg-gray-800 hover:text-gold-800 dark:hover:text-gold-200"
                  }`}
                  onClick={handleBookmark}
                >
                  <Bookmark className={`h-5 w-5 ${isBookmarked ? "fill-gold-400" : ""}`} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className={`rounded-full border-gold-200 dark:border-gray-700 ${
                    isLiked
                      ? "bg-red-100/50 dark:bg-red-900/20 text-red-500 dark:text-red-400 border-red-200 dark:border-red-800"
                      : "text-gold-800 dark:text-gold-200 hover:bg-gold-200/50 dark:hover:bg-gray-800 hover:text-gold-800 dark:hover:text-gold-200"
                  }`}
                  onClick={handleLike}
                >
                  <Heart className={`h-5 w-5 ${isLiked ? "fill-red-500" : ""}`} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-gold-200 dark:border-gray-700 text-gold-800 dark:text-gold-200 hover:bg-gold-200/50 dark:hover:bg-gray-800 hover:text-gold-800 dark:hover:text-gold-200"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          </div>

          <div className="md:w-2/3 lg:w-3/4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-gold-200 text-gold-800 dark:bg-gray-800 dark:text-gold-200 hover:bg-gold-200 dark:hover:bg-gray-800 border-none">
                  {book?.category?.name || "دسته‌بندی نشده"}
                </Badge>
                <Badge variant="outline" className="border-gold-400 text-gold-800 dark:text-gold-200">
                  سطح {book?.level || "متوسط"}
                </Badge>
                {book?.has_free_trial && (
                  <Badge className="bg-gradient-to-r from-gold-300 to-gold-400 hover:opacity-90 text-white border-none">
                    نسخه رایگان
                  </Badge>
                )}
                {book?.discount_percentage > 0 && (
                  <Badge className="bg-red-500 hover:bg-red-600 text-white border-none">
                    {book?.discount_percentage}٪ تخفیف
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gold-800 dark:text-gold-200 mb-2">{book?.title}</h1>
              <p className="text-gold-700 dark:text-gold-300 mb-4">نویسنده: {book?.author?.name || "ناشناس"}</p>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 ml-1" />
                  <span className="font-bold text-gold-800 dark:text-gold-200">{book?.rating?.toFixed(1) || "0.0"}</span>
                  <span className="text-gold-700 dark:text-gold-300 mr-1">({book?.reviewCount || 0} نظر)</span>
                </div>
                <div className="flex items-center text-gold-700 dark:text-gold-300">
                  <BookText className="h-4 w-4 ml-1" />
                  <span>{book?.page_count || 0} صفحه</span>
                </div>
                <div className="flex items-center text-gold-700 dark:text-gold-300">
                  <Clock className="h-4 w-4 ml-1" />
                  <span>{book?.read_time || "نامشخص"}</span>
                </div>
              </div>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="bg-white/50 dark:bg-gray-900/50 p-1 rounded-full h-auto mb-6">
                  <TabsTrigger
                    value="overview"
                    className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-300 data-[state=active]:to-gold-400 data-[state=active]:text-white"
                  >
                    معرفی کتاب
                  </TabsTrigger>
                  <TabsTrigger
                    value="skills"
                    className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-300 data-[state=active]:to-gold-400 data-[state=active]:text-white"
                  >
                    مهارت‌ها
                  </TabsTrigger>
                  <TabsTrigger
                    value="details"
                    className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-300 data-[state=active]:to-gold-400 data-[state=active]:text-white"
                  >
                    جزئیات
                  </TabsTrigger>
                  <TabsTrigger
                    value="reviews"
                    className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-gold-300 data-[state=active]:to-gold-400 data-[state=active]:text-white"
                  >
                    نظرات
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-0">
                  <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-lg">
                    <p className="text-gold-800 dark:text-gold-200 leading-relaxed">
                      {book?.description || "توضیحاتی برای این کتاب ثبت نشده است."}
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="skills" className="mt-0">
                  <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-lg">
                    <h3 className="font-bold text-lg text-gold-800 dark:text-gold-200 mb-4">
                      مهارت‌هایی که با خواندن این کتاب می‌آموزید:
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {book?.tags && book?.tags.length > 0 ? (
                        book.tags.map((tag: string, index: number) => (
                          <div key={index} className="flex items-center">
                            <Award className="h-5 w-5 text-gold-400 ml-2" />
                            <span className="text-gold-800 dark:text-gold-200">{tag}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gold-700 dark:text-gold-300 col-span-3">
                          مهارتی برای این کتاب ثبت نشده است.
                        </p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="details" className="mt-0">
                  <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-bold text-lg text-gold-800 dark:text-gold-200 mb-4">اطلاعات کتاب</h3>
                        <ul className="space-y-3">
                          <li className="flex justify-between">
                            <span className="text-gold-700 dark:text-gold-300">نویسنده:</span>
                            <span className="font-medium text-gold-800 dark:text-gold-200">
                              {book?.author?.name || "ناشناس"}
                            </span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-gold-700 dark:text-gold-300">تاریخ انتشار:</span>
                            <span className="font-medium text-gold-800 dark:text-gold-200">
                              {book?.publish_date || "نامشخص"}
                            </span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-gold-700 dark:text-gold-300">تعداد صفحات:</span>
                            <span className="font-medium text-gold-800 dark:text-gold-200">{book?.page_count || 0}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-gold-700 dark:text-gold-300">زبان:</span>
                            <span className="font-medium text-gold-800 dark:text-gold-200">
                              {book?.language || "فارسی"}
                            </span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gold-800 dark:text-gold-200 mb-4">اطلاعات خواندن</h3>
                        <ul className="space-y-3">
                          <li className="flex justify-between">
                            <span className="text-gold-700 dark:text-gold-300">زمان تقریبی مطالعه:</span>
                            <span className="font-medium text-gold-800 dark:text-gold-200">
                              {book?.read_time || "نامشخص"}
                            </span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-gold-700 dark:text-gold-300">سطح:</span>
                            <span className="font-medium text-gold-800 dark:text-gold-200">
                              {book?.level || "متوسط"}
                            </span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-gold-700 dark:text-gold-300">دسته‌بندی:</span>
                            <span className="font-medium text-gold-800 dark:text-gold-200">
                              {book?.category?.name || "دسته‌بندی نشده"}
                            </span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-gold-700 dark:text-gold-300">قیمت:</span>
                            <span className="font-medium text-gold-800 dark:text-gold-200">
                              {formatPrice(book?.price)}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="mt-0">
                  <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-full mr-4">
                          <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                        </div>
                        <div>
                          <div className="flex items-end">
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
