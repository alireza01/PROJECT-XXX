"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, BookOpen, Bookmark, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HighlightedText } from './highlighted-text'
import { updateReadingProgress, getUserBookmarks, addBookmark } from '@/lib/user-progress'
import { getPageWords } from '@/lib/vocabulary'
import { Level } from '@prisma/client'

interface BookReaderProps {
  userId: string
  bookId: string
  initialPage: number
  totalPages: number
  content: string
  bookTitle: string
  userLevel: Level
  pageId: string
}

export function BookReader({
  userId,
  bookId,
  initialPage,
  totalPages,
  content,
  bookTitle,
  userLevel,
  pageId,
}: BookReaderProps) {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [wordPositions, setWordPositions] = useState([])
  const [loading, setLoading] = useState(false)
  const [bookmarks, setBookmarks] = useState([])
  const [isCurrentPageBookmarked, setIsCurrentPageBookmarked] = useState(false)
  
  // Load word positions for the current page
  useEffect(() => {
    const loadPageWords = async () => {
      try {
        const words = await getPageWords(pageId, userLevel)
        setWordPositions(words)
      } catch (error) {
        console.error("Error loading page words:", error)
      }
    }
    
    loadPageWords()
  }, [pageId, userLevel])
  
  // Load user's bookmarks for this book
  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const bookmarkData = await getUserBookmarks(userId, bookId)
        setBookmarks(bookmarkData)
        
        // Check if current page is bookmarked
        setIsCurrentPageBookmarked(
          bookmarkData.some(bookmark => bookmark.pageNumber === currentPage)
        )
      } catch (error) {
        console.error("Error loading bookmarks:", error)
      }
    }
    
    loadBookmarks()
  }, [userId, bookId, currentPage])
  
  // Update reading progress when page changes
  useEffect(() => {
    const saveProgress = async () => {
      try {
        await updateReadingProgress(userId, bookId, currentPage)
      } catch (error) {
        console.error("Error saving reading progress:", error)
      }
    }
    
    saveProgress()
  }, [userId, bookId, currentPage])
  
  // Navigate to previous page
  const goToPreviousPage = async () => {
    if (currentPage > 1) {
      setLoading(true)
      try {
        // In a real implementation, this would navigate to the previous page
        // and fetch its content from the server
        router.push(`/books/${bookId}/read?page=${currentPage - 1}`)
      } catch (error) {
        console.error("Error navigating to previous page:", error)
      } finally {
        setLoading(false)
      }
    }
  }
  
  // Navigate to next page
  const goToNextPage = async () => {
    if (currentPage < totalPages) {
      setLoading(true)
      try {
        // In a real implementation, this would navigate to the next page
        // and fetch its content from the server
        router.push(`/books/${bookId}/read?page=${currentPage + 1}`)
      } catch (error) {
        console.error("Error navigating to next page:", error)
      } finally {
        setLoading(false)
      }
    }
  }
  
  // Toggle bookmark for current page
  const toggleBookmark = async () => {
    try {
      if (isCurrentPageBookmarked) {
        // In a real implementation, you would delete the bookmark
        // For now, we'll just console.log
        console.log("Would delete bookmark for page", currentPage)
      } else {
        await addBookmark(userId, bookId, currentPage)
        // Refresh bookmarks
        const bookmarkData = await getUserBookmarks(userId, bookId)
        setBookmarks(bookmarkData)
        setIsCurrentPageBookmarked(true)
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error)
    }
  }
  
  return (
    <div className="flex flex-col h-full">
      {/* Reader header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-xl font-semibold">{bookTitle}</h1>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleBookmark}
            title={isCurrentPageBookmarked ? "حذف نشانک" : "افزودن نشانک"}
          >
            <Bookmark 
              className={`h-5 w-5 ${isCurrentPageBookmarked ? "fill-primary text-primary" : ""}`} 
            />
          </Button>
          
          <Button variant="ghost" size="icon" title="تنظیمات">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Page content */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-white dark:bg-gray-950">
        <div className="max-w-3xl mx-auto">
          <HighlightedText content={content} wordPositions={wordPositions} />
        </div>
      </div>
      
      {/* Page navigation */}
      <div className="flex items-center justify-between p-4 border-t">
        <Button
          variant="outline"
          onClick={goToPreviousPage}
          disabled={currentPage === 1 || loading}
        >
          <ChevronRight className="ml-2 h-4 w-4" />
          صفحه قبل
        </Button>
        
        <div className="flex items-center">
          <BookOpen className="h-5 w-5 mr-2" />
          <span>
            صفحه {currentPage} از {totalPages}
          </span>
        </div>
        
        <Button
          variant="outline"
          onClick={goToNextPage}
          disabled={currentPage === totalPages || loading}
        >
          صفحه بعد
          <ChevronLeft className="mr-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
