import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    db: {
      schema: 'public'
    }
  }
)

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error)
  throw new Error(error.message || 'An error occurred while accessing the database')
}

// Type-safe database queries
export const db = {
  books: {
    async getAll() {
      const { data, error } = await supabase
        .from('books')
        .select('*')
      if (error) handleSupabaseError(error)
      return data
    },
    async getById(id: string) {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single()
      if (error) handleSupabaseError(error)
      return data
    },
    async create(book: Database['public']['Tables']['books']['Insert']) {
      const { data, error } = await supabase
        .from('books')
        .insert(book)
        .select()
        .single()
      if (error) handleSupabaseError(error)
      return data
    },
    async update(id: string, updates: Database['public']['Tables']['books']['Update']) {
      const { data, error } = await supabase
        .from('books')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) handleSupabaseError(error)
      return data
    },
    async delete(id: string) {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id)
      if (error) handleSupabaseError(error)
    }
  },
  users: {
    async getProfile(userId: string) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      if (error) handleSupabaseError(error)
      return data
    },
    async updateProfile(userId: string, updates: Database['public']['Tables']['profiles']['Update']) {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()
      if (error) handleSupabaseError(error)
      return data
    }
  },
  bookmarks: {
    async getByUser(userId: string) {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*, books(*)')
        .eq('user_id', userId)
      if (error) handleSupabaseError(error)
      return data
    },
    async create(bookmark: Database['public']['Tables']['bookmarks']['Insert']) {
      const { data, error } = await supabase
        .from('bookmarks')
        .insert(bookmark)
        .select()
        .single()
      if (error) handleSupabaseError(error)
      return data
    },
    async delete(id: string) {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', id)
      if (error) handleSupabaseError(error)
    }
  },
  readingProgress: {
    async getByUser(userId: string) {
      const { data, error } = await supabase
        .from('reading_progress')
        .select('*, books(*)')
        .eq('user_id', userId)
      if (error) handleSupabaseError(error)
      return data
    },
    async upsert(progress: Database['public']['Tables']['reading_progress']['Insert']) {
      const { data, error } = await supabase
        .from('reading_progress')
        .upsert(progress)
        .select()
        .single()
      if (error) handleSupabaseError(error)
      return data
    }
  }
} 