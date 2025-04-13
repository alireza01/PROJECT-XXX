import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface BookContent {
  id: string
  title: string
  content: string
  author: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  vocabulary: {
    word: string
    level: 'beginner' | 'intermediate' | 'advanced'
    translation: string
    explanation: string
  }[]
}

export function useBookContent(bookId: string) {
  const [content, setContent] = useState<BookContent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchBookContent = async () => {
      try {
        const { data, error } = await supabase
          .from('books')
          .select(`
            *,
            vocabulary:book_vocabulary (
              word,
              level,
              translation,
              explanation
            )
          `)
          .eq('id', bookId)
          .single()

        if (error) throw error
        setContent(data)
      } catch (error) {
        console.error('Error fetching book content:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (bookId) {
      fetchBookContent()
    }
  }, [bookId, supabase])

  const updateBookContent = async (newContent: Partial<BookContent>) => {
    try {
      const { error } = await supabase
        .from('books')
        .update({
          ...newContent,
          updated_at: new Date().toISOString(),
        })
        .eq('id', bookId)

      if (error) throw error
      setContent(prev => prev ? { ...prev, ...newContent } : null)
    } catch (error) {
      console.error('Error updating book content:', error)
      throw error
    }
  }

  const addVocabulary = async (vocabulary: BookContent['vocabulary'][0]) => {
    try {
      const { error } = await supabase
        .from('book_vocabulary')
        .insert({
          book_id: bookId,
          ...vocabulary,
        })

      if (error) throw error
      setContent(prev => {
        if (!prev) return null
        return {
          ...prev,
          vocabulary: [...prev.vocabulary, vocabulary],
        }
      })
    } catch (error) {
      console.error('Error adding vocabulary:', error)
      throw error
    }
  }

  return { content, isLoading, updateBookContent, addVocabulary }
} 