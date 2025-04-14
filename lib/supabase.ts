import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

// Helper functions for common operations
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data
}

export const updateProfile = async (userId: string, updates: Partial<Database['public']['Tables']['profiles']['Update']>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const getBooks = async (userId?: string) => {
  let query = supabase
    .from('books')
    .select(`
      *,
      author:authors(*),
      category:categories(*)
    `)
  
  if (userId) {
    query = query.eq('user_id', userId)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data
}

export const getBook = async (id: string) => {
  const { data, error } = await supabase
    .from('books')
    .select(`
      *,
      author:authors(*),
      category:categories(*)
    `)
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

export const createBook = async (book: Database['public']['Tables']['books']['Insert']) => {
  const { data, error } = await supabase
    .from('books')
    .insert(book)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const updateBook = async (id: string, updates: Partial<Database['public']['Tables']['books']['Update']>) => {
  const { data, error } = await supabase
    .from('books')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const deleteBook = async (id: string) => {
  const { error } = await supabase
    .from('books')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

export const getReadingProgress = async (userId: string, bookId: string) => {
  const { data, error } = await supabase
    .from('reading_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('book_id', bookId)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error
  return data
}

export const updateReadingProgress = async (
  userId: string,
  bookId: string,
  progress: number
) => {
  const { data, error } = await supabase
    .from('reading_progress')
    .upsert({
      user_id: userId,
      book_id: bookId,
      progress
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const getBookmarks = async (userId: string, bookId: string) => {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', userId)
    .eq('book_id', bookId)
  
  if (error) throw error
  return data
}

export const createBookmark = async (
  userId: string,
  bookId: string,
  position: number
) => {
  const { data, error } = await supabase
    .from('bookmarks')
    .insert({
      user_id: userId,
      book_id: bookId,
      position
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const getHighlights = async (userId: string, bookId: string) => {
  const { data, error } = await supabase
    .from('highlights')
    .select('*')
    .eq('user_id', userId)
    .eq('book_id', bookId)
  
  if (error) throw error
  return data
}

export const createHighlight = async (
  userId: string,
  bookId: string,
  text: string
) => {
  const { data, error } = await supabase
    .from('highlights')
    .insert({
      user_id: userId,
      book_id: bookId,
      text
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const getNotes = async (userId: string, bookId: string) => {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', userId)
    .eq('book_id', bookId)
  
  if (error) throw error
  return data
}

export const createNote = async (
  userId: string,
  bookId: string,
  text: string,
  note: string
) => {
  const { data, error } = await supabase
    .from('notes')
    .insert({
      user_id: userId,
      book_id: bookId,
      text,
      note
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const getVocabulary = async (bookId: string) => {
  const { data, error } = await supabase
    .from('vocabulary')
    .select('*')
    .eq('book_id', bookId)
  
  if (error) throw error
  return data
}

export const createVocabulary = async (
  word: string,
  meaning: string,
  explanation: string,
  level: Database['public']['Enums']['vocabulary_level'],
  bookId: string,
  createdById: string
) => {
  const { data, error } = await supabase
    .from('vocabulary')
    .insert({
      word,
      meaning,
      explanation,
      level,
      book_id: bookId,
      created_by_id: createdById
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Storage helpers
export const uploadBookCover = async (file: File, bookId: string) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${bookId}-${Math.random()}.${fileExt}`
  const filePath = `book-covers/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('books')
    .upload(filePath, file)

  if (uploadError) throw uploadError

  const { data: { publicUrl } } = supabase.storage
    .from('books')
    .getPublicUrl(filePath)

  return publicUrl
}

export const deleteBookCover = async (url: string) => {
  const filePath = url.split('/').pop()
  if (!filePath) return

  const { error } = await supabase.storage
    .from('books')
    .remove([`book-covers/${filePath}`])

  if (error) throw error
}

export const getUser = async (id: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const getUserByEmail = async (email: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const createUser = async (userData: { 
  name: string; 
  email: string; 
  password: string;
}) => {
  const { data, error } = await supabase
    .from('users')
    .insert([userData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateUser = async (id: string, userData: any) => {
  const { data, error } = await supabase
    .from('users')
    .update(userData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Helper function to handle Supabase responses
export function handleSupabaseResponse<T>(response: { data: T | null; error: any }) {
  if (response.error) {
    console.error('Supabase error:', response.error);
    throw response.error;
  }
  
  if (!response.data) {
    throw new Error('No data returned from Supabase');
  }
  
  return response.data;
} 