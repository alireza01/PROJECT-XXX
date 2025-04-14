"use client"

import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useSwipeable } from 'react-swipeable'
import { cn } from '@/lib/utils'
import { VocabularyLevel } from '@/types'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { supabase } from "@/lib/supabase/client"
import { updateReadingProgress, getUserBookmarks, addBookmark } from '@/lib/user-progress'
import { getPageWords } from '@/lib/vocabulary'

// UI Components
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Icons
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
  BookOpen,
} from "lucide-react"

// Feature Components
import { WordTooltip } from "../ui/WordTooltip"
import { VocabularyTooltip } from "../ui/VocabularyTooltip"
import { ReadingProgress } from "../features/ReadingProgress"
import { PageControls } from "../features/PageControls"
import { HighlightedText } from "../ui/HighlightedText"

interface Bookmark {
  id: string;
  pageNumber: number;
  createdAt: Date;
}

interface WordPosition {
  word: string;
  start: number;
  end: number;
  level: VocabularyLevel;
}

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
  bookId: string
  initialPage: number
  totalPages: number
  userLevel: VocabularyLevel
  pageId: string
}

export function BookReader({
  book,
  pageContent,
  currentPage,
  maxAccessiblePage,
  hasPurchased,
  userId,
  bookId,
  initialPage,
  totalPages,
  userLevel,
  pageId,
}: BookReaderProps) {
  // State Management
  const [isLoading, setIsLoading] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [fontSize, setFontSize] = useState(16)
  const [lineHeight, setLineHeight] = useState(1.6)
  const [selectedWord, setSelectedWord] = useState<string | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [chapters, setChapters] = useState<{ title: string; page: number }[]>([])
  const [wordPositions, setWordPositions] = useState<WordPosition[]>([])
  const [readingProgress, setReadingProgress] = useState(0)

  // Refs
  const readerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Keyboard Navigation
  useKeyboardShortcuts({
    'ArrowLeft': () => handlePrevPage(),
    'ArrowRight': () => handleNextPage(),
    'j': () => handleNextPage(),
    'k': () => handlePrevPage(),
  })

  // Swipe Gestures
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleNextPage(),
    onSwipedRight: () => handlePrevPage(),
  })

  // Effects
  useEffect(() => {
    if (userId) {
      checkBookmark()
      checkLike()
      loadBookmarks()
    }
    fetchChapters()
    loadPageWords()
    saveProgress()
  }, [currentPage, userId])

  // Handlers
  const handlePrevPage = () => {
    if (currentPage > 1) {
      router.push(`/books/${book.slug}/${currentPage - 1}`)
    }
  }

  const handleNextPage = () => {
    if (currentPage < maxAccessiblePage) {
      router.push(`/books/${book.slug}/${currentPage + 1}`)
    }
  }

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode)

  const handleWordClick = (e: React.MouseEvent) => {
    const selection = window.getSelection()
    if (!selection) return

    const word = selection.toString().trim()
    if (word && word.length > 0) {
      setSelectedWord(word)
      setTooltipPosition({
        x: e.clientX,
        y: e.clientY
      })
    }
  }

  const handleCloseTooltip = () => {
    setSelectedWord(null)
  }

  // Feature Handlers
  const checkBookmark = async () => {
    if (!userId) return
    const userBookmarks = await getUserBookmarks(userId, bookId)
    setIsBookmarked(userBookmarks.some((b: Bookmark) => b.pageNumber === currentPage))
  }

  const checkLike = async () => {
    if (!userId) return
    const { data } = await supabase
      .from('book_likes')
      .select('*')
      .eq('user_id', userId)
      .eq('book_id', bookId)
      .single()
    setIsLiked(!!data)
  }

  const handleBookmark = async () => {
    if (!userId) return
    await addBookmark(userId, bookId, currentPage.toString())
    setIsBookmarked(!isBookmarked)
    await loadBookmarks()
  }

  const handleLike = async () => {
    if (!userId) return
    const { error } = await supabase
      .from('book_likes')
      .upsert({
        user_id: userId,
        book_id: bookId,
        created_at: new Date().toISOString()
      })
    if (!error) {
      setIsLiked(!isLiked)
    }
  }

  // Data Loading
  const fetchChapters = async () => {
    const { data } = await supabase
      .from('book_chapters')
      .select('*')
      .eq('book_id', bookId)
      .order('chapter_number')
    if (data) {
      setChapters(data.map(ch => ({
        title: ch.title,
        page: ch.page_number
      })))
    }
  }

  const loadPageWords = async () => {
    const words = await getPageWords(pageId, userLevel)
    setWordPositions(words)
  }

  const loadBookmarks = async () => {
    if (!userId) return
    const userBookmarks = await getUserBookmarks(userId, bookId)
    setBookmarks(userBookmarks)
  }

  const saveProgress = async () => {
    if (!userId) return
    await updateReadingProgress(userId, bookId, currentPage, totalPages)
    setReadingProgress((currentPage / totalPages) * 100)
  }

  return (
    <div className="relative min-h-screen bg-background">
      <div
        ref={readerRef}
        {...swipeHandlers}
        className={cn(
          "max-w-4xl mx-auto px-4 py-8",
          isDarkMode ? "dark" : ""
        )}
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: lineHeight
        }}
      >
        {/* Reading Content */}
        <div
          className="prose prose-lg dark:prose-invert max-w-none"
          onClick={handleWordClick}
        >
          <HighlightedText
            content={pageContent.content}
            wordPositions={wordPositions}
            userLevel={userLevel}
          />
        </div>

        {/* Controls */}
        <PageControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
          isBookmarked={isBookmarked}
          onBookmark={handleBookmark}
          isLiked={isLiked}
          onLike={handleLike}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          fontSize={fontSize}
          onFontSizeChange={setFontSize}
          lineHeight={lineHeight}
          onLineHeightChange={setLineHeight}
          chapters={chapters}
          onChapterSelect={(page: number) => router.push(`/books/${book.slug}/${page}`)}
        />

        {/* Progress */}
        <ReadingProgress
          progress={readingProgress}
          currentPage={currentPage}
          totalPages={totalPages}
        />

        {/* Word Tooltip */}
        <AnimatePresence>
          {selectedWord && (
            <WordTooltip
              word={selectedWord}
              position={tooltipPosition}
              onClose={handleCloseTooltip}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
} 