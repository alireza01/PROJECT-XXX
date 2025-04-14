"use client"

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

type VocabularyWord = Database['public']['Tables']['vocabulary']['Row']

export function VocabularyList() {
  const [words, setWords] = useState<VocabularyWord[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setError('Please sign in to view your vocabulary list')
          return
        }

        const { data, error: fetchError } = await supabase
          .from('vocabulary')
          .select('*')
          .eq('created_by_id', user.id)
          .order('created_at', { ascending: false })

        if (fetchError) throw fetchError
        setWords(data || [])
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch words'
        setError(errorMessage)
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchWords()
  }, [supabase]) // Include supabase client in dependencies

  const deleteWord = async (id: string) => {
    try {
      setDeleteLoading(id)
      const { error: deleteError } = await supabase
        .from('vocabulary')
        .delete()
        .eq('id', id)
        .single()

      if (deleteError) throw deleteError
      
      setWords(prevWords => prevWords.filter(word => word.id !== id))
      toast({
        title: 'Success',
        description: 'Word deleted successfully',
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete word'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setDeleteLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-4 rounded-lg bg-destructive/10 text-destructive">
        {error}
      </div>
    )
  }

  if (words.length === 0) {
    return (
      <div className="text-center p-4 rounded-lg bg-muted">
        No vocabulary words found. Start adding some words to your list!
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {words.map((word) => (
        <Card key={word.id} className="flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold">{word.word}</CardTitle>
              <Badge 
                variant={
                  word.level === 'BEGINNER' 
                    ? 'default' 
                    : word.level === 'INTERMEDIATE' 
                      ? 'secondary' 
                      : 'destructive'
                }
              >
                {word.level.toLowerCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <p className="mb-2 flex-1">{word.meaning}</p>
            {word.explanation && (
              <p className="text-sm text-muted-foreground italic mb-4">
                {word.explanation}
              </p>
            )}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteWord(word.id)}
              disabled={deleteLoading === word.id}
              className="w-full"
            >
              {deleteLoading === word.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Delete'
              )}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 