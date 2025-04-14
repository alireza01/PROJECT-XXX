"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { supabase } from './supabase'
import type { Session } from '@supabase/supabase-js'

// Define VocabularyLevel type
export type VocabularyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'

// Book schema for validation
const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  authorId: z.string().min(1, "Author is required"),
  categoryId: z.string().min(1, "Category is required"),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  description: z.string().min(10, "Description must be at least 10 characters"),
  publishDate: z.string().optional(),
  pageCount: z.coerce.number().int().positive().optional(),
  price: z.coerce.number().nonnegative().optional(),
  discount: z.coerce.number().min(0).max(100).optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  tags: z.array(z.string()).default([]),
})

// Word schema for validation
const wordSchema = z.object({
  word: z.string().min(1, "Word is required"),
  meaning: z.string().min(1, "Meaning is required"),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  category: z.string().optional(),
  example: z.string().optional(),
  pronunciation: z.string().optional(),
})

// Page word position schema
const pageWordPositionSchema = z.object({
  pageId: z.string().min(1, "Page ID is required"),
  wordId: z.string().min(1, "Word ID is required"),
  startIndex: z.number().int().nonnegative(),
  endIndex: z.number().int().positive(),
})

interface BookWithRelations {
  id: string;
  title: string;
  author: any;
  category: any;
  pages: any[];
  progress?: Array<{ current_page: number }>;
  bookmarks?: any[];
  likes?: any[];
}

// Update reading progress
export async function updateReadingProgress(
  bookId: string,
  pageNumber: number,
  completionPercentage: number,
) {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user?.id) throw new Error("Not authenticated")

    const { data, error } = await supabase
      .from('reading_progress')
      .upsert({
        user_id: session.user.id,
        book_id: bookId,
        current_page: pageNumber,
        completion_percentage: completionPercentage,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    revalidatePath(`/books/${bookId}`)
    return data
  } catch (error) {
    console.error("Error updating reading progress:", error)
    throw error
  }
}

// Toggle bookmark
export async function toggleBookmark(bookId: string) {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user?.id) throw new Error("Not authenticated")

    const { data: existingBookmark, error: fetchError } = await supabase
      .from('bookmarks')
      .select()
      .eq('user_id', session.user.id)
      .eq('book_id', bookId)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError

    if (existingBookmark) {
      const { error: deleteError } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', existingBookmark.id)
      
      if (deleteError) throw deleteError
      revalidatePath(`/books/${bookId}`)
      return null
    } else {
      const { data, error: insertError } = await supabase
        .from('bookmarks')
        .insert({
          user_id: session.user.id,
          book_id: bookId,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (insertError) throw insertError
      revalidatePath(`/books/${bookId}`)
      return data
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error)
    throw error
  }
}

// Toggle like
export async function toggleLike(bookId: string) {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user?.id) throw new Error("Not authenticated")

    const { data: existingLike, error: fetchError } = await supabase
      .from('likes')
      .select()
      .eq('user_id', session.user.id)
      .eq('book_id', bookId)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError

    if (existingLike) {
      const { error: deleteError } = await supabase
        .from('likes')
        .delete()
        .eq('id', existingLike.id)
      
      if (deleteError) throw deleteError
      revalidatePath(`/books/${bookId}`)
      return { liked: false }
    } else {
      const { data, error: insertError } = await supabase
        .from('likes')
        .insert({
          user_id: session.user.id,
          book_id: bookId,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (insertError) throw insertError
      revalidatePath(`/books/${bookId}`)
      return { liked: true }
    }
  } catch (error) {
    console.error("Error toggling like:", error)
    throw error
  }
}

// Get book with current page
export async function getBookWithCurrentPage(bookId: string) {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    const userId = session?.user?.id

    const baseQuery = `
      id,
      title,
      author:authors(*),
      category:categories(*),
      pages:book_pages(*)
    `

    const userQuery = userId ? `
      ${baseQuery},
      progress:reading_progress(current_page),
      bookmarks:bookmarks(*),
      likes:likes(*)
    ` : baseQuery

    const { data: book, error: bookError } = await supabase
      .from('books')
      .select(userQuery)
      .eq('id', bookId)
      .single()

    if (bookError) throw bookError
    if (!book) throw new Error("Book not found")

    // Type assertion with unknown as intermediate step
    const typedBook = book as unknown as BookWithRelations

    // Get current page from reading progress or default to first page
    const currentPage = userId && typedBook.progress?.[0]
      ? typedBook.progress[0].current_page
      : 1

    return {
      ...typedBook,
      currentPage,
      isBookmarked: userId ? (typedBook.bookmarks || []).length > 0 : false,
      isLiked: userId ? (typedBook.likes || []).length > 0 : false,
    }
  } catch (error) {
    console.error("Error getting book with current page:", error)
    throw error
  }
}

// Update word progress
export async function updateWordProgress(wordId: string, status: 'LEARNED' | 'REVIEWING' | 'NEW') {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from('word_progress')
      .upsert({
        user_id: session.user.id,
        word_id: wordId,
        status,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    revalidatePath('/vocabulary');
    return data;
  } catch (error) {
    console.error("Error updating word progress:", error);
    throw error;
  }
}

// Increment word search count
export async function incrementWordSearchCount(wordId: string) {
  try {
    await supabase.from('words').update({
      searchCount: {
        increment: 1,
      },
    }).eq('id', wordId)
  } catch (error) {
    console.error("Error incrementing word search count:", error)
    throw new Error("Failed to increment word search count")
  }
}

export async function updateUserProgress(
  userId: string,
  bookId: string,
  progress: number
) {
  const { data, error } = await supabase
    .from('reading_progress')
    .upsert({
      userId,
      bookId,
      progress,
      updatedAt: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createBookmark(
  userId: string,
  bookId: string,
  position: number
) {
  const { data, error } = await supabase
    .from('bookmarks')
    .insert([{
      userId,
      bookId,
      position,
      createdAt: new Date().toISOString(),
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBookmark(id: string) {
  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function createHighlight(
  userId: string,
  bookId: string,
  text: string
) {
  const { data, error } = await supabase
    .from('highlights')
    .insert([{
      userId,
      bookId,
      text,
      createdAt: new Date().toISOString(),
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createNote(
  userId: string,
  bookId: string,
  text: string,
  note: string
) {
  const { data, error } = await supabase
    .from('notes')
    .insert([{
      userId,
      bookId,
      text,
      note,
      createdAt: new Date().toISOString(),
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update vocabulary
export async function updateVocabulary(
  id: string,
  updates: Partial<{
    word: string;
    meaning: string;
    explanation: string;
    level: VocabularyLevel;
  }>
) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from('vocabulary')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    revalidatePath('/vocabulary');
    return data;
  } catch (error) {
    console.error("Error updating vocabulary:", error);
    throw error;
  }
} 