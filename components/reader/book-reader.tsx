"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ChevronLeft, ChevronRight, Bookmark, Settings, Moon, Sun, Home, Type, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { WordTooltip } from "./word-tooltip"
import { useSwipeable } from 'react-swipeable'
import { cn } from '@/lib/utils'
import { Book, VocabularyLevel } from '@/types'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { VocabularyTooltip } from './vocabulary-tooltip'
import { ReadingProgress } from './reading-progress'
import { PageControls } from './page-controls'

interface BookReaderProps {
  book: Book
  userLevel: VocabularyLevel
  onPageChange: (page: number) => void
  currentPage: number
}

export function BookReader({
  book,
  userLevel,
  onPageChange,
  currentPage,
}: BookReaderProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [highlightedWords, setHighlightedWords] = useState<Set<string>>(new Set())
  const readerRef = useRef<HTMLDivElement>(null)
  const [selectedWord, setSelectedWord] = useState<string | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  // Handle keyboard navigation
  useKeyboardShortcuts({
    'ArrowLeft': () => onPageChange(currentPage - 1),
    'ArrowRight': () => onPageChange(currentPage + 1),
  })

  // Handle swipe gestures
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => onPageChange(currentPage + 1),
    onSwipedRight: () => onPageChange(currentPage - 1),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  })

  // Load and process book content
  useEffect(() => {
    const processContent = async () => {
      setIsLoading(true)
      try {
        // Process vocabulary based on user level
        const words = await processVocabulary(book.content, userLevel)
        setHighlightedWords(new Set(words))
      } catch (error) {
        console.error('Error processing book content:', error)
      } finally {
        setIsLoading(false)
      }
    }

    processContent()
  }, [book.content, userLevel])

  const handleWordClick = (word: string, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setTooltipPosition({
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY + rect.height,
    })
    setSelectedWord(word)
  }

  const handleCloseTooltip = () => {
    setSelectedWord(null)
  }

  const getWordLevel = (word: string): VocabularyLevel => {
    // This would be replaced with actual logic to determine word level
    // For now, we'll use a simple example
    if (word.length < 5) return "beginner"
    if (word.length < 8) return "intermediate"
    return "advanced"
  }

  const renderContent = (content: string) => {
    const words = content.split(/\s+/);
    return words.map((word, index) => {
      const isHighlighted = highlightedWords.has(word.toLowerCase())
      const level = getWordLevel(word)
      const isVocabulary = book.vocabulary.includes(word)
      return (
        <span
          key={`${word}-${index}`}
          className={cn(
            'inline-block transition-colors duration-200',
            isHighlighted && 'text-blue-500 cursor-help',
            isVocabulary && 'text-blue-600 dark:text-blue-400'
          )}
          onClick={(e) => handleWordClick(word, e)}
        >
          {isHighlighted ? (
            <VocabularyTooltip word={word} level={level} position={tooltipPosition} onClose={handleCloseTooltip} userLevel={userLevel}>
              {word}
            </VocabularyTooltip>
          ) : (
            word
          )}
          {' '}
        </span>
      )
    })
  }

  return (
    <div className="relative w-full h-full bg-white dark:bg-gray-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 overflow-y-auto p-8"
          ref={readerRef}
          {...swipeHandlers}
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
            </div>
          ) : (
            <div className="prose prose-lg max-w-3xl mx-auto">
              {renderContent(book.content)}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <ReadingProgress
        currentPage={currentPage}
        totalPages={book.totalPages}
      />

      <PageControls
        currentPage={currentPage}
        totalPages={book.totalPages}
        onPageChange={onPageChange}
      />

      {selectedWord && (
        <VocabularyTooltip
          word={selectedWord}
          level={getWordLevel(selectedWord)}
          position={tooltipPosition}
          onClose={handleCloseTooltip}
          userLevel={userLevel}
        />
      )}
    </div>
  )
}
