"use client"

import React from 'react'
import { WordExplanationModal } from './word-modal'
import { Database } from '@/types/supabase'

type Word = Database['public']['Tables']['vocabulary']['Row']

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

export function HighlightedText({ content, wordPositions }: HighlightedTextProps): React.ReactElement {
  const [selectedWord, setSelectedWord] = React.useState<Word | null>(null)

  const handleWordClick = (position: WordPosition): void => {
    const word = content.slice(position.start, position.end)
    // Fetch explanation from API or use existing data
    setSelectedWord({
      id: position.id,
      word,
      meaning: 'معنی فارسی',
      explanation: 'توضیحات',
      level: 'BEGINNER',
      book_id: '',
      created_by_id: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
  }

  const renderContent = (): React.ReactNode[] => {
    if (!wordPositions.length) {
      return [<span key="content">{content}</span>]
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
          word={selectedWord}
          onClose={() => setSelectedWord(null)}
        />
      )}
    </div>
  )
} 