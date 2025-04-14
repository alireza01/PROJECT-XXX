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
import { supabase, handleSupabaseResponse } from "@/lib/supabase"
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
import { HighlightedText } from './highlighted-text'
import { updateReadingProgress, getUserBookmarks, addBookmark, removeBookmark } from '@/lib/user-progress'
import { getPageWords } from '@/lib/vocabulary'
import { VocabularyLevel } from '@/types/vocabulary'
import { useAuth } from '@/hooks/useAuth'
import { PostgrestSingleResponse, PostgrestResponse } from '@supabase/supabase-js'
import type { AuthHook } from '@/types/auth'
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Level } from '@/lib/prisma-client'

interface Bookmark {
  id: string;
  user_id: string;
  book_id: string;
  page: number;
  created_at: string;
}

interface WordPosition {
  id: string;
  start: number;
  end: number;
  explanationId: string;
  word?: string;
}

interface BookReaderProps {
  book: {
    id: string
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
  const [wordPositions, setWordPositions] = useState<WordPosition[]>([])
  const [loading, setLoading] = useState(false)
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [isCurrentPageBookmarked, setIsCurrentPageBookmarked] = useState(false)

  const contentRef = useRef<HTMLDivElement>(null)
  const readerContainerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const { loading: authLoading } = useAuth() as AuthHook

  const loadBookmarks = async () => {
    if (!userId || !bookId) return;
    
    try {
      const response: PostgrestResponse<Bookmark> = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', userId)
        .eq('book_id', book.id);

      if (response.error) throw response.error;
      setBookmarks(response.data || []);
      setIsCurrentPageBookmarked(response.data?.some(b => b.page === currentPage) || false);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && userId) {
      loadBookmarks()
    }
  }, [authLoading, userId, bookId])

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

    // Load word positions for the current page
    const loadPageWords = async () => {
      try {
        // Convert VocabularyLevel to Level type
        const levelMap: Record<VocabularyLevel, Level> = {
          'beginner': 'BEGINNER',
          'intermediate': 'INTERMEDIATE',
          'advanced': 'ADVANCED'
        };
        const mappedLevel = levelMap[userLevel];
        
        const words = await getPageWords(pageId, mappedLevel);
        // Transform the words into the format expected by HighlightedText
        const transformedWords = words.map((word, index) => ({
          id: word.id,
          start: word.start || 0,
          end: word.end || 0,
          explanationId: word.id,
          word: word.word || ''
        }));
        setWordPositions(transformedWords);
      } catch (error) {
        console.error("Error loading page words:", error);
      }
    };

    // Update reading progress when page changes
    const saveProgress = async () => {
      if (!userId || !pageId) return;
      
      try {
        await updateReadingProgress(
          userId,
          bookId,
          pageId,
          currentPage
        );
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    };

    checkBookmark()
    checkLike()
    fetchChapters()
    fetchWords()
    loadPageWords()
    saveProgress()

    // Add keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrevPage()
      } else if (e.key === "ArrowRight") {
        handleNextPage()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [book.id, userId, bookId, currentPage, userLevel, pageId, totalPages])

  const handlePrevPage = () => {
    if (currentPage > 1) {
      router.push(`/books/${book.slug}/page/${currentPage - 1}`)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      router.push(`/books/${book.slug}/page/${currentPage + 1}`)
    }
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleWordClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.classList.contains("word")) {
      const word = target.textContent
      const rect = target.getBoundingClientRect()
      setSelectedWord({
        word: word || "",
        meaning: "Loading...",
        explanation: "Loading...",
        level: target.dataset.level || "beginner",
        position: {
          x: rect.left + window.scrollX,
          y: rect.top + window.scrollY,
        },
      })
    }
  };

  const goToChapter = (page: number) => {
    router.push(`/books/${book.slug}/page/${page}`)
    setShowChapters(false)
  }

  const handleBookmark = async () => {
    if (!userId) return;
    
    try {
      if (isCurrentPageBookmarked) {
        const currentBookmark = bookmarks.find(b => b.page === currentPage);
        if (currentBookmark) {
          await removeBookmark(currentBookmark.id);
          setIsCurrentPageBookmarked(false);
        }
      } else {
        await addBookmark(userId, bookId, pageId);
        setIsCurrentPageBookmarked(true);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const handleLike = async () => {
    if (!userId) return;
    
    try {
      if (isLiked) {
        const { error } = await supabase
          .from("user_likes")
          .delete()
          .eq("user_id", userId)
          .eq("book_id", book.id);
          
        if (error) throw error;
        setIsLiked(false);
      } else {
        const { error } = await supabase
          .from("user_likes")
          .insert({
            user_id: userId,
            book_id: book.id
          });
          
        if (error) throw error;
        setIsLiked(true);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  // Process content to highlight words
  const processContent = (content: string) => {
    let processedContent = content;
    wordPositions.forEach((position) => {
      const { start, end, word } = position;
      if (word) {
        const before = processedContent.substring(0, start);
        const after = processedContent.substring(end);
        processedContent = `${before}<span class="word" data-word="${word}">${word}</span>${after}`;
        const wordRegex = new RegExp(`\\b${word}\\b`, 'gi');
        processedContent = processedContent.replace(
          wordRegex,
          `<span class="word" data-word="${word}">${word}</span>`
        );
      }
    });
    
    return processedContent;
  };

  const toggleBookmark = async () => {
    if (!userId || !bookId) return;
    
    try {
      if (isCurrentPageBookmarked) {
        const currentBookmark = bookmarks.find(b => b.page === currentPage);
        if (currentBookmark) {
          await removeBookmark(currentBookmark.id);
          setBookmarks(bookmarks.filter(b => b.page !== currentPage));
          setIsCurrentPageBookmarked(false);
        }
      } else {
        const result = await addBookmark(userId, bookId, pageId);
        if (result && 
            typeof result === 'object' && 
            'id' in result && 
            'user_id' in result && 
            'book_id' in result && 
            'page' in result && 
            'created_at' in result) {
          setBookmarks([...bookmarks, result as unknown as Bookmark]);
          setIsCurrentPageBookmarked(true);
        }
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  return (
    <div className="relative min-h-screen bg-background">
      <motion.div
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFontSize(fontSize + 2)}
            >
              <Type className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBookmark}
              className={isBookmarked ? "text-primary" : ""}
            >
              <Bookmark className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={isLiked ? "text-primary" : ""}
            >
              <Heart className="w-5 h-5" />
            </Button>
            <Sheet open={showChapters} onOpenChange={setShowChapters}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <List className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Chapters</SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-2">
                  {chapters.map((chapter) => (
                    <Button
                      key={chapter.chapter_number}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => goToChapter(chapter.page_number)}
                    >
                      {chapter.chapter_title}
                    </Button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.div>

      <div className="container pt-20 pb-16">
        <Card>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              <h2 className="text-2xl font-bold mb-4">
                {pageContent.chapter_title}
              </h2>
              <div
                ref={contentRef}
                className="text-lg leading-relaxed"
                style={{ fontSize: `${fontSize}px` }}
                onClick={handleWordClick}
              >
                <HighlightedText
                  content={pageContent.content}
                  wordPositions={wordPositions}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t p-4">
        <div className="container flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-4">
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Progress value={(currentPage / totalPages) * 100} className="w-32" />
          </div>
          <Button
            variant="ghost"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {selectedWord && (
          <WordTooltip
            word={selectedWord.word}
            meaning={selectedWord.meaning}
            explanation={selectedWord.explanation}
            level={selectedWord.level}
            position={selectedWord.position}
            onClose={() => setSelectedWord(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}