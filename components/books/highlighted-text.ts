"use client"

import React from 'react'
import { Word } from '@prisma/client'
import { WordExplanationModal } from './word-explanation-modal'

interface WordPosition {
  id: string
  start: number
  end: number
  explanationId: string
}

interface HighlightedTextProps {
  content: string
  wordPositions: WordPosition[]
}

export function HighlightedText({ content, wordPositions }: HighlightedTextProps) {
  const [selectedWord, setSelectedWord] = React.useState<{
    word: string
    explanation: any
  } | null>(null)

  const handleWordClick = (position: WordPosition) => {
    const word = content.slice(position.start, position.end)
    // Fetch explanation from API or use existing data
    setSelectedWord({
      word,
      explanation: {
        persianMeaning: 'معنی فارسی',
        englishMeaning: 'English meaning',
        example: 'Example sentence',
      },
    })
  }

  const renderContent = () => {
    if (!wordPositions.length) {
      return <span>{content}</span>
    }

    const elements: React.ReactNode[] = []
    let lastEnd = 0

    wordPositions.forEach((position) => {
      // Add text before the word
      if (position.start > lastEnd) {
        elements.push(
          <span key={`text-${lastEnd}`}>
            {content.slice(lastEnd, position.start)}
          </span>
        )
      }

      // Add the highlighted word
      elements.push(
        <span
          key={`word-${position.id}`}
          className="text-primary cursor-pointer hover:underline"
          onClick={() => handleWordClick(position)}
          data-explanation-id={position.explanationId}
        >
          {content.slice(position.start, position.end)}
        </span>
      )

      lastEnd = position.end
    })

    // Add remaining text
    if (lastEnd < content.length) {
      elements.push(
        <span key={`text-${lastEnd}`}>
          {content.slice(lastEnd)}
        </span>
      )
    }

    return elements
  }

  return (
    <div className="text-lg leading-relaxed">
      {renderContent()}
      {selectedWord && (
        <WordExplanationModal
          word={selectedWord.word}
          explanation={selectedWord.explanation}
          onClose={() => setSelectedWord(null)}
        />
      )}
    </div>
  )
}
