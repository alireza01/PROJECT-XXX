import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'

interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: 'en' | 'fa'
  fontSize: number
  notifications: {
    email: boolean
    push: boolean
    sound: boolean
  }
  readingPreferences: {
    showTranslations: boolean
    autoPlayAudio: boolean
    highlightWords: boolean
  }
  readingLevel: 'beginner' | 'intermediate' | 'advanced'
}

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          setIsLoading(false)
          return
        }

        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', session.user.id)
          .single()

        if (error) throw error
        setPreferences(data as UserPreferences)
      } catch (err) {
        console.error('Error fetching preferences:', err)
        setError(err instanceof Error ? err : new Error('Failed to fetch preferences'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchPreferences()
  }, [supabase])

  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: session.user.id,
          ...newPreferences,
          updated_at: new Date().toISOString(),
        })

      if (error) throw error
      setPreferences((prev: UserPreferences | null) => 
        prev ? { ...prev, ...newPreferences } : null
      )
    } catch (err) {
      console.error('Error updating preferences:', err)
      setError(err instanceof Error ? err : new Error('Failed to update preferences'))
      throw err
    }
  }

  const resetPreferences = async () => {
    if (!preferences) throw new Error('Preferences not initialized')

    try {
      setIsLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not authenticated')

      const defaultPreferences: UserPreferences = {
        theme: 'system',
        language: 'fa',
        fontSize: 16,
        notifications: {
          email: true,
          push: true,
          sound: true
        },
        readingPreferences: {
          showTranslations: true,
          autoPlayAudio: false,
          highlightWords: true
        },
        readingLevel: 'intermediate'
      }

      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: session.user.id,
          ...defaultPreferences,
          updated_at: new Date().toISOString(),
        })

      if (error) throw error
      setPreferences(defaultPreferences)
    } catch (err) {
      console.error('Error resetting preferences:', err)
      setError(err instanceof Error ? err : new Error('Failed to reset preferences'))
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    preferences,
    isLoading,
    error,
    resetPreferences,
    updatePreferences,
  }
} 