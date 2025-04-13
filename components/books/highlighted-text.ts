"use client"

import { useState, useCallback } from 'react'
import { Word } from '@prisma/client'
import { WordExplanationModal } from './word-explanation-modal'

interface BookWordPosition {
  id: string
  startOffset: number
  endOffset: number
  explanationId: string
  word: Word
  explanation: {
    id: string
    persianMeaning: string
    explanation: string | null
    example: string | null
  }
}

interface HighlightedTextProps {
  content: string
  wordPositions: BookWordPosition[]
}

export function HighlightedText({ content, wordPositions }: HighlightedTextProps) {
  const [selectedWord, setSelectedWord] = useState<BookWordPosition | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Sort word positions by start offset to process them in order
  const sortedPositions = [...wordPositions].sort((a, b) => a.startOffset - b.startOffset)
  
  // Handle word click
  const handleWordClick = useCallback((wordPosition: BookWordPosition) => {
    setSelectedWord(wordPosition)
    setIsModalOpen(true)
  }, [])

  // Close the explanation modal
  const closeModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  // Generate the text segments with highlighted words
  const renderTextSegments = () => {
    const segments = []
    let lastEnd = 0
    
    // Process each word position in order
    for (const position of sortedPositions) {
      // Add the text before this word
      if (position.startOffset > lastEnd) {
        segments.push(
          <span key={`text-${lastEnd}`}>
            {content.slice(lastEnd, position.startOffset)}
          </span>
        )
      }
      
      // Add the highlighted word
      segments.push(
        <span
          key={`word-${position.id}`}
          className="cursor-pointer rounded px-0.5 bg-yellow-200 hover:bg-yellow-300 dark:bg-yellow-900 dark:hover:bg-yellow-800"
          onClick={() => handleWordClick(position)}
          data-explanation-id={position.explanationId}
        >
          {content.slice(position.startOffset, position.endOffset)}
        </span>
      )
      
      lastEnd = position.endOffset
    }
    
    // Add any remaining text
    if (lastEnd < content.length) {
      segments.push(
        <span key={`text-${lastEnd}`}>
          {content.slice(lastEnd)}
        </span>
      )
    }
    
    return segments
  }
  
  return (
    <div className="text-lg leading-relaxed">
      {renderTextSegments()}
      
      {/* Word explanation modal */}
      {selectedWord && (
        <WordExplanationModal
          word={selectedWord.word}
          explanation={selectedWord.explanation}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </div>
  )
}
