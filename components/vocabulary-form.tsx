import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'
import { Button } from '@/components/ui/button'

type Level = Database['public']['Tables']['vocabulary']['Row']['level']

export function VocabularyForm() {
  const [word, setWord] = useState('')
  const [definition, setDefinition] = useState('')
  const [example, setExample] = useState('')
  const [pronunciation, setPronunciation] = useState('')
  const [category, setCategory] = useState('')
  const [level, setLevel] = useState<Level>('BEGINNER')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClientComponentClient<Database>()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('vocabulary')
        .insert([
          {
            word,
            definition,
            example,
            pronunciation,
            category,
            level,
          },
        ])

      if (error) throw error

      // Reset form
      setWord('')
      setDefinition('')
      setExample('')
      setPronunciation('')
      setCategory('')
      setLevel('BEGINNER')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 p-3 rounded-md">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="word" className="block text-sm font-medium mb-1">
          Word
        </label>
        <input
          id="word"
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
        />
      </div>

      <div>
        <label htmlFor="definition" className="block text-sm font-medium mb-1">
          Definition
        </label>
        <textarea
          id="definition"
          value={definition}
          onChange={(e) => setDefinition(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
          rows={3}
        />
      </div>

      <div>
        <label htmlFor="example" className="block text-sm font-medium mb-1">
          Example (optional)
        </label>
        <textarea
          id="example"
          value={example}
          onChange={(e) => setExample(e.target.value)}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
          rows={2}
        />
      </div>

      <div>
        <label htmlFor="pronunciation" className="block text-sm font-medium mb-1">
          Pronunciation (optional)
        </label>
        <input
          id="pronunciation"
          type="text"
          value={pronunciation}
          onChange={(e) => setPronunciation(e.target.value)}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-1">
          Category (optional)
        </label>
        <input
          id="category"
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
        />
      </div>

      <div>
        <label htmlFor="level" className="block text-sm font-medium mb-1">
          Level
        </label>
        <select
          id="level"
          value={level}
          onChange={(e) => setLevel(e.target.value as Level)}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
        >
          <option value="BEGINNER">Beginner</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="ADVANCED">Advanced</option>
        </select>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Word'}
      </Button>
    </form>
  )
} 