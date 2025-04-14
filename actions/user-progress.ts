"use server";

import { createClient } from '@supabase/supabase-js'
import { getUserProgress, updateReadingProgress, getBookmarks as getBookmarksFromDb, createBookmark, deleteBookmark } from '@/lib/supabase/db'
import { getBookById } from '@/lib/supabase/db'
import { revalidatePath } from 'next/cache';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Helper function to get authenticated user ID
async function getAuthenticatedUserId(): Promise<string> {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    console.error("Authentication error:", error?.message || "User not found");
    throw new Error("User not authenticated");
  }
  return user.id;
}

export type ProgressWithBook = {
  id: string
  user_id: string
  book_id: string
  current_page: number
  completion_percentage: number
  created_at: string
  updated_at: string
  book: {
    id: string
    title: string
    author_id: string
    category_id: string
    description: string
    level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
    publish_date: string | null
    page_count: number | null
    price: number | null
    discount: number | null
    meta_title: string | null
    meta_description: string | null
    tags: string[]
    created_at: string
    updated_at: string
  }
}

export type Bookmark = {
  id: string
  user_id: string
  book_id: string
  position: number
  created_at: string
  updated_at: string
}

export async function getProgress(userId: string, bookId: string) {
  try {
    const progress = await getUserProgress(userId, bookId)
    return progress
  } catch (error) {
    console.error('Error getting progress:', error)
    return null
  }
}

export async function getReadingHistory(userId: string) {
  try {
    const reading = await getUserProgress(userId, '')
    return reading
  } catch (error) {
    console.error('Error getting reading history:', error)
    return []
  }
}

export async function updateProgress(
  userId: string,
  bookId: string,
  currentPage: number,
  completionPercentage: number
) {
  try {
    const book = await getBookById(bookId)
    if (!book) {
      throw new Error('Book not found')
    }

    const progress = await updateReadingProgress(
      userId,
      bookId,
      currentPage,
      completionPercentage
    )
    return progress
  } catch (error) {
    console.error('Error updating progress:', error)
    throw error
  }
}

export async function addBookmark(userId: string, bookId: string, position: number) {
  try {
    const bookmark = await createBookmark(userId, bookId, position)
    return bookmark
  } catch (error) {
    console.error('Error adding bookmark:', error)
    throw error
  }
}

export async function getBookmarks(userId: string): Promise<Bookmark[]> {
  try {
    const bookmarks = await getBookmarksFromDb(userId)
    return bookmarks
  } catch (error) {
    console.error('Error getting bookmarks:', error)
    return []
  }
}

export async function removeBookmark(userId: string, bookId: string) {
  try {
    await deleteBookmark(userId, bookId)
  } catch (error) {
    console.error('Error removing bookmark:', error)
    throw error
  }
}

export async function getAllProgress(userId: string): Promise<ProgressWithBook[]> {
  try {
    const allProgress = await getUserProgress(userId, '')
    return allProgress as ProgressWithBook[]
  } catch (error) {
    console.error('Error getting all progress:', error)
    return []
  }
}

// --- Stats Action ---

export async function getUserReadingStatsAction() {
  try {
    const userId = 'test-user-id' // TODO: Get actual user ID from auth
    const allProgress: ProgressWithBook[] = await getUserProgress(userId, '')

    const totalBooksStarted = allProgress.length
    const booksCompleted = allProgress.filter(p => p.completion_percentage >= 100).length
    const totalPagesRead = 0 // Placeholder: Cannot calculate total pages read without page numbers or total pages per book
    const recentlyActive = 0 // Placeholder: Cannot calculate recently active without lastRead timestamp

    return {
      totalBooksStarted,
      booksCompleted,
      totalPagesRead,
      recentlyActive
    }
  } catch (error) {
    console.error('Error getting reading stats:', error)
    return {
      totalBooksStarted: 0,
      booksCompleted: 0,
      totalPagesRead: 0,
      recentlyActive: 0
    }
  }
}