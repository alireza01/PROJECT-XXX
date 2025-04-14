import { supabase } from './client'
import type { Database } from '@/types/supabase'

// Books
export async function getBooks() {
  const { data, error } = await supabase
    .from('books')
    .select('*, authors(*), categories(*)')
  
  if (error) throw error
  return data
}

export async function getBookById(id: string) {
  const { data, error } = await supabase
    .from('books')
    .select('*, authors(*), categories(*)')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

// Categories
export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
  
  if (error) throw error
  return data
}

// Authors
export async function getAuthors() {
  const { data, error } = await supabase
    .from('authors')
    .select('*')
  
  if (error) throw error
  return data
}

// Reading Progress
export async function getUserProgress(userId: string, bookId: string) {
  const { data, error } = await supabase
    .from('reading_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('book_id', bookId)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error // PGRST116 is "no rows returned"
  return data
}

export async function updateReadingProgress(
  userId: string,
  bookId: string,
  currentPage: number,
  completionPercentage: number
) {
  const { data, error } = await supabase
    .from('reading_progress')
    .upsert({
      user_id: userId,
      book_id: bookId,
      current_page: currentPage,
      completion_percentage: completionPercentage
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Bookmarks
export async function getBookmarks(userId: string) {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('*, books(*)')
    .eq('user_id', userId)
  
  if (error) throw error
  return data
}

export async function createBookmark(userId: string, bookId: string, position: number) {
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

export async function deleteBookmark(userId: string, bookId: string) {
  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('user_id', userId)
    .eq('book_id', bookId)
  
  if (error) throw error
}

// Vocabulary
export async function getVocabulary(bookId: string) {
  const { data, error } = await supabase
    .from('vocabulary')
    .select('*')
    .eq('book_id', bookId)
  
  if (error) throw error
  return data
}

export async function createVocabularyEntry(
  word: string,
  meaning: string,
  explanation: string | null,
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
  bookId: string,
  createdById: string
) {
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

// Likes
export async function toggleLike(userId: string, bookId: string) {
  // First check if like exists
  const { data: existingLike, error: checkError } = await supabase
    .from('likes')
    .select('*')
    .eq('user_id', userId)
    .eq('book_id', bookId)
    .single()
  
  if (checkError && checkError.code !== 'PGRST116') throw checkError
  
  if (existingLike) {
    // Unlike
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('id', existingLike.id)
    
    if (error) throw error
    return null
  } else {
    // Like
    const { data, error } = await supabase
      .from('likes')
      .insert({
        user_id: userId,
        book_id: bookId
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// Profiles
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function updateProfile(
  userId: string,
  updates: {
    username?: string
    full_name?: string
    avatar_url?: string
  }
) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      user_id: userId,
      ...updates
    })
    .select()
    .single()
  
  if (error) throw error
  return data
} 