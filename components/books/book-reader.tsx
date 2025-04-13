"use client"

import React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Progress } from "@/components/ui/progress"
import { WordTooltip } from "./word-tooltip"
import { supabase } from "@/lib/supabase/client"
import {
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Settings,
  Moon,
  Sun,
  Type,
  X,
  Share2,
  Heart,
  List,
  Home,
  CreditCard,
} from "lucide-react"

interface BookReaderProps {
  book: {
    id: number
    title: string
    slug: string
    page_count: number
    has_free_trial: boolean
    free_pages: number
  }
  pageContent: {
    content: string
    chapter_title: string
    chapter_number: number
  }
  currentPage: number
  maxAccessiblePage: number
  hasPurchased: boolean
  userId?: string
}

export function BookReader({
  book,
  pageContent,
  currentPage,
  maxAccessiblePage,
  hasPurchased,
  userId,
}: BookReaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [fontSize, setFontSize] = useState(18)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isWordTooltipVisible, setIsWordTooltipVisible] = useState(false)
  const [selectedWord, setSelectedWord] = useState<{
    word: string
    meaning: string
    explanation: string
    level: string
    position: { x: number; y: number }
  } | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [showChapters, setShowChapters] = useState(false)
  const [chapters, setChapters] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [words, setWords] = useState<any[]>([])

  const contentRef = useRef<HTMLDivElement>(null)
  const readerContainerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user has bookmarked this book
    const checkBookmark = async () => {
      if (!userId) return

      try {
        const { data } = await supabase
          .from("user_bookmarks")
          .select("id")
          .eq("user_id", userId)
          .eq("book_id", book.id)
          .single()

        setIsBookmarked(!!data)
      } catch (error) {
        console.error("Error checking bookmark:", error)
      }
    }

    // Check if user has liked this book
    const checkLike = async () => {
      if (!userId) return

      try {
        const { data } = await supabase
          .from("user_likes")
          .select("id")
          .eq("user_id", userId)
          .eq("book_id", book.id)
          .single()

        setIsLiked(!!data)
      } catch (error) {
        console.error("Error checking like:", error)
      }
    }

    // Fetch chapters for this book
    const fetchChapters = async () => {
      try {
        const { data } = await supabase
          .from("book_content")
          .select("chapter_number, chapter_title, page_number")
          .eq("book_id", book.id)
          .order("chapter_number")
          .order("page_number")

        // Get unique chapters
        const uniqueChapters =
          data?.reduce((acc: any[], curr) => {
            const existingChapter = acc.find((ch) => ch.chapter_number === curr.chapter_number)
            if (!existingChapter) {
              acc.push({
                chapter_number: curr.chapter_number,
                chapter_title: curr.chapter_title,
                page_number: curr.page_number,
              })
            }
            return acc
          }, []) || []

        setChapters(uniqueChapters)
      } catch (error) {
        console.error("Error fetching chapters:", error)
      }
    }

    // Fetch words for this book
    const fetchWords = async () => {
      try {
        const { data } = await supabase
          .from("words")
          .select("word, translation, explanation, level")
          .eq("book_id", book.id)

        setWords(data || [])
      } catch (error) {
        console.error("Error fetching words:", error)
      }
    }

    checkBookmark()
    checkLike()
    fetchChapters()
    fetchWords()

    // Add keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handleNextPage()
      } else if (e.key === "ArrowRight") {
        handlePrevPage()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [book.id, userId])

  const handlePrevPage = () => {
    if (currentPage > 1) {
      router.push(`/books/${book.slug}/read?page=${currentPage - 1}`)
    }
  }

  const handleNextPage = () => {
    if (currentPage < maxAccessiblePage) {
      router.push(`/books/${book.slug}/read?page=${currentPage + 1}`)
    }
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleWordClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement

    if (target.classList.contains("word")) {
      const wordText = target.getAttribute("data-word") || ""
      const level =
        Array.from(target.classList).find((cls) => ["beginner", "intermediate", "advanced"].includes(cls)) || "beginner"

      // Find word in our database
      const wordData = words.find((w) => w.word.toLowerCase() === wordText.toLowerCase())

      const rect = target.getBoundingClientRect()
      const containerRect = contentRef.current?.getBoundingClientRect() || { left: 0, top: 0 }

      setSelectedWord({
        word: wordText,
        meaning: wordData?.translation || "معنی فارسی کلمه",
        explanation: wordData?.explanation || "توضیحات بیشتر درباره کلمه و کاربرد آن در جمله",
        level: wordData?.level || level,
        position: {
          x: rect.left + rect.width / 2 - containerRect.left,
          y: rect.bottom - containerRect.top,
        },
      })

      setIsWordTooltipVisible(true)
    } else {
      setIsWordTooltipVisible(false)
    }
  }

  const goToChapter = (page: number) => {
    router.push(`/books/${book.slug}/read?page=${page}`)
    setShowChapters(false)
  }

  const handleBookmark = async () => {
    if (!userId) return

    setIsLoading(true)
    try {
      if (isBookmarked) {
        // Remove bookmark
        await supabase.from("user_bookmarks").delete().eq("user_id", userId).eq("book_id", book.id)

        setIsBookmarked(false)
      } else {
        // Add bookmark
        await supabase.from("user_bookmarks").insert({
          user_id: userId,
          book_id: book.id,
        })

        setIsBookmarked(true)
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLike = async () => {
    if (!userId) return

    setIsLoading(true)
    try {
      if (isLiked) {
        // Remove like
        await supabase.from("user_likes").delete().eq("user_id", userId).eq("book_id", book.id)

        setIsLiked(false)
      } else {
        // Add like
        await supabase.from("user_likes").insert({
          user_id: userId,
          book_id: book.id,
        })

        setIsLiked(true)
      }
    } catch (error) {
      console.error("Error toggling like:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Process content to highlight words
  const processContent = (content: string) => {
    if (!content) return ""

    let processedContent = content

    // If we have words data, highlight them in the content
    if (words.length > 0) {
      words.forEach((word) => {
        const regex = new RegExp(`\\b${word.word}\\b`, "gi")
        processedContent = processedContent.replace(
          regex,
          `<span class="word ${word.level}" data-word="${word.word}">$&</span>`,
        )
      })
    }

    return processedContent
  }

  return (
    <div
      ref={readerContainerRef}
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-gold-50" : "bg-gold-50 text-gold-800"
      } transition-colors duration-300`}
    >
      {/* Header */}
      <div
        className={`sticky top-0 z-10 flex justify-between items-center p-4 ${
          isDarkMode
            ? "bg-gray-900/90 backdrop-blur-md border-b border-gray-800"
            : "bg-gold-50/90 backdrop-blur-md border-b border-gold-200"
        } transition-colors duration-300`}
      >
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className={`rounded-full ${
              isDarkMode
                ? "text-gold-50 hover:bg-gray-800 hover:text-gold-50"
                : "text-gold-800 hover:bg-gold-100/50 hover:text-gold-800"
            }`}
          >
            <Link href={`/books/${book.slug}`}>
              <X className="h-5 w-5" />
            </Link>
          </Button>
          <h2 className="font-bold text-sm md:text-base">{book.title}</h2>
        </div>

        <div className="text-center hidden md:block">
          <p className={`text-sm ${isDarkMode ? "text-gold-50/70" : "text-gold-700"}`}>
            صفحه {currentPage} از {book.page_count}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full ${
              isDarkMode
                ? "text-gold-50 hover:bg-gray-800 hover:text-gold-50"
                : "text-gold-800 hover:bg-gold-100/50 hover:text-gold-800"
            } ${isBookmarked ? "text-gold-400" : ""}`}
            onClick={handleBookmark}
            disabled={isLoading}
          >
            <Bookmark className={`h-5 w-5 ${isBookmarked ? "fill-gold-400" : ""}`} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full ${
              isDarkMode
                ? "text-gold-50 hover:bg-gray-800 hover:text-gold-50"
                : "text-gold-800 hover:bg-gold-100/50 hover:text-gold-800"
            } ${isLiked ? "text-red-500" : ""}`}
            onClick={handleLike}
            disabled={isLoading}
          >
            <Heart className={`h-5 w-5 ${isLiked ? "fill-red-500" : ""}`} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full ${
              isDarkMode
                ? "text-gold-50 hover:bg-gray-800 hover:text-gold-50"
                : "text-gold-800 hover:bg-gold-100/50 hover:text-gold-800"
            }`}
          >
            <Share2 className="h-5 w-5" />
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full ${
                  isDarkMode
                    ? "text-gold-50 hover:bg-gray-800 hover:text-gold-50"
                    : "text-gold-800 hover:bg-gold-100/50 hover:text-gold-800"
                }`}
              >
                <Settings className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className={`w-80 ${
                isDarkMode ? "bg-gray-900 text-gold-50 border-gray-800" : "bg-gold-50 text-gold-800 border-gold-200"
              }`}
            >
              <SheetHeader>
                <SheetTitle className={isDarkMode ? "text-gold-50" : "text-gold-800"}>تنظیمات</SheetTitle>
              </SheetHeader>
              <div className="space-y-6 mt-6">
                <div className="space-y-2">
                  <h3 className={`text-sm font-medium ${isDarkMode ? "text-gold-50" : "text-gold-800"}`}>اندازه متن</h3>
                  <div className="flex items-center gap-4">
                    <Type className={`h-4 w-4 ${isDarkMode ? "text-gold-50/70" : "text-gold-700"}`} />
                    <Slider
                      defaultValue={[fontSize]}
                      max={32}
                      min={12}
                      step={1}
                      onValueChange={(value) => setFontSize(value[0])}
                      className="flex-1"
                    />
                    <span className={`text-sm w-8 text-center ${isDarkMode ? "text-gold-50" : "text-gold-800"}`}>
                      {fontSize}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className={`text-sm font-medium ${isDarkMode ? "text-gold-50" : "text-gold-800"}`}>حالت نمایش</h3>
                  <Button
                    variant="outline"
                    className={`w-full justify-start ${
                      isDarkMode
                        ? "border-gray-800 text-gold-50 hover:bg-gray-800 hover:text-gold-50"
                        : "border-gold-200 text-gold-800 hover:bg-gold-100/50 hover:text-gold-800"
                    }`}
                    onClick={toggleDarkMode}
                  >
                    {isDarkMode ? (
                      <>
                        <Sun className="ml-2 h-4 w-4" /> حالت روشن
                      </>
                    ) : (
                      <>
                        <Moon className="ml-2 h-4 w-4" /> حالت تاریک
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Book Content */}
      <div className="relative flex justify-center items-center py-8 px-4">
        <Button
          variant="ghost"
          size="icon"
          className={`fixed right-4 top-1/2 transform -translate-y-1/2 z-10 ${
            isDarkMode ? "bg-gray-800/80 hover:bg-gray-800 text-gold-50" : "bg-white/80 hover:bg-white text-gold-800"
          } rounded-full shadow-lg hidden md:flex h-12 w-12`}
          onClick={handlePrevPage}
          disabled={currentPage <= 1}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        <div
          className={`relative max-w-2xl mx-auto ${
            isDarkMode ? "bg-gray-900 border border-gray-800" : "bg-white border border-gold-200"
          } rounded-3xl shadow-2xl p-8 md:p-12 min-h-[70vh]`}
          style={{ direction: "ltr" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              {pageContent.chapter_title && (
                <h2 className={`text-xl font-bold mb-6 text-center ${isDarkMode ? "text-gold-50" : "text-gold-800"}`}>
                  {pageContent.chapter_title}
                </h2>
              )}

              <div
                ref={contentRef}
                className={`prose prose-lg ${isDarkMode ? "prose-invert" : ""} max-w-none`}
                style={{ fontSize: `${fontSize}px` }}
                onClick={handleWordClick}
                dangerouslySetInnerHTML={{ __html: processContent(pageContent.content) }}
              />

              {isWordTooltipVisible && selectedWord && (
                <WordTooltip
                  word={selectedWord.word}
                  meaning={selectedWord.meaning}
                  explanation={selectedWord.explanation}
                  level={selectedWord.level}
                  position={selectedWord.position}
                  onClose={() => setIsWordTooltipVisible(false)}
                  isDarkMode={isDarkMode}
                />
              )}

              {currentPage === maxAccessiblePage && !hasPurchased && (
                <div className={`mt-8 p-6 ${isDarkMode ? "bg-gray-800" : "bg-gold-100"} rounded-2xl text-center`}>
                  <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? "text-gold-50" : "text-gold-800"}`}>
                    برای ادامه مطالعه، نسخه کامل را خریداری کنید
                  </h3>
                  <p className={`mb-4 ${isDarkMode ? "text-gold-50/70" : "text-gold-700"}`}>
                    با خرید نسخه کامل، به تمام {book.page_count} صفحه کتاب دسترسی خواهید داشت
                  </p>
                  <Button className="bg-gradient-to-r from-gold-300 to-gold-400 hover:opacity-90 text-white rounded-full shadow-md">
                    <CreditCard className="ml-2 h-4 w-4" />
                    خرید نسخه کامل
                  </Button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className={`fixed left-4 top-1/2 transform -translate-y-1/2 z-10 ${
            isDarkMode ? "bg-gray-800/80 hover:bg-gray-800 text-gold-50" : "bg-white/80 hover:bg-white text-gold-800"
          } rounded-full shadow-lg hidden md:flex h-12 w-12`}
          onClick={handleNextPage}
          disabled={currentPage >= maxAccessiblePage}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>

      {/* Chapters Sheet */}
      <Sheet open={showChapters} onOpenChange={setShowChapters}>
        <SheetContent
          side="right"
          className={`w-80 ${
            isDarkMode ? "bg-gray-900 text-gold-50 border-gray-800" : "bg-gold-50 text-gold-800 border-gold-200"
          }`}
        >
          <SheetHeader>
            <SheetTitle className={isDarkMode ? "text-gold-50" : "text-gold-800"}>فهرست مطالب</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <div className="space-y-2">
              {chapters.map((chapter) => (
                <Button
                  key={chapter.chapter_number}
                  variant="ghost"
                  className={`w-full justify-start ${
                    currentPage === chapter.page_number
                      ? isDarkMode
                        ? "bg-gray-800 text-gold-400"
                        : "bg-gold-100/50 text-gold-400"
                      : isDarkMode
                        ? "text-gold-50 hover:bg-gray-800 hover:text-gold-50"
                        : "text-gold-800 hover:bg-gold-100/50 hover:text-gold-800"
                  }`}
                  onClick={() => goToChapter(chapter.page_number)}
                >
                  <span className="ml-2 font-bold">فصل {chapter.chapter_number}:</span>
                  <span className="truncate">{chapter.chapter_title}</span>
                </Button>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Mobile Navigation */}
      <div
        className={`fixed bottom-0 left-0 right-0 ${
          isDarkMode
            ? "bg-gray-900/90 backdrop-blur-md border-t border-gray-800"
            : "bg-gold-50/90 backdrop-blur-md border-t border-gold-200"
        } p-4 flex flex-col gap-2 transition-colors duration-300`}
      >
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full ${
              isDarkMode
                ? "text-gold-50 hover:bg-gray-800 hover:text-gold-50"
                : "text-gold-800 hover:bg-gold-100/50 hover:text-gold-800"
            }`}
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          <div className="flex-1 mx-4">
            <div className="flex items-center justify-center mb-1">
              <span className={`text-xs ${isDarkMode ? "text-gold-50/70" : "text-gold-700"}`}>
                صفحه {currentPage} از {book.page_count}
              </span>
            </div>
            <Progress
              value={(currentPage / book.page_count) * 100}
              className={`h-1 ${isDarkMode ? "bg-gray-800" : "bg-gold-100"}`}
            >
              <div className="h-full bg-gradient-to-r from-gold-300 to-gold-400 rounded-full" />
            </Progress>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full ${
              isDarkMode
                ? "text-gold-50 hover:bg-gray-800 hover:text-gold-50"
                : "text-gold-800 hover:bg-gold-100/50 hover:text-gold-800"
            }`}
            onClick={handleNextPage}
            disabled={currentPage >= maxAccessiblePage}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </div>

        <div className="flex justify-between">
          <Button
            variant="ghost"
            size="sm"
            className={`rounded-full ${
              isDarkMode
                ? "text-gold-50 hover:bg-gray-800 hover:text-gold-50"
                : "text-gold-800 hover:bg-gold-100/50 hover:text-gold-800"
            }`}
            asChild
          >
            <Link href="/dashboard">
              <Home className="h-4 w-4 ml-1" />
              <span className="text-xs">خانه</span>
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={`rounded-full ${
              isDarkMode
                ? "text-gold-50 hover:bg-gray-800 hover:text-gold-50"
                : "text-gold-800 hover:bg-gold-100/50 hover:text-gold-800"
            }`}
            onClick={() => setShowChapters(true)}
          >
            <List className="h-4 w-4 ml-1" />
            <span className="text-xs">فهرست</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={`rounded-full ${
              isDarkMode
                ? "text-gold-50 hover:bg-gray-800 hover:text-gold-50"
                : "text-gold-800 hover:bg-gold-100/50 hover:text-gold-800"
            }`}
            onClick={toggleDarkMode}
          >
            {isDarkMode ? (
              <>
                <Sun className="h-4 w-4 ml-1" />
                <span className="text-xs">روشن</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 ml-1" />
                <span className="text-xs">تاریک</span>
              </>
            )}
          </Button>
        </div>
      </div>

      <style jsx global>{`
        .word {
          position: relative;
          cursor: pointer;
          border-radius: 2px;
          padding: 0 2px;
        }
        
        .word.beginner {
          background-color: rgba(230, 185, 128, 0.2);
          border-bottom: 2px solid rgba(230, 185, 128, 0.8);
        }
        
        .word.intermediate {
          background-color: rgba(210, 158, 100, 0.2);
          border-bottom: 2px solid rgba(210, 158, 100, 0.8);
        }
        
        .word.advanced {
          background-color: rgba(190, 131, 72, 0.2);
          border-bottom: 2px solid rgba(190, 131, 72, 0.8);
        }
        
        .dark .word.beginner {
          background-color: rgba(230, 185, 128, 0.3);
        }
        
        .dark .word.intermediate {
          background-color: rgba(210, 158, 100, 0.3);
        }
        
        .dark .word.advanced {
          background-color: rgba(190, 131, 72, 0.3);
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
