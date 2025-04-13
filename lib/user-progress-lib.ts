import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

// Get user's reading progress for a specific book
export async function getUserBookProgress(userId: string, bookId: string) {
  try {
    const progress = await prisma.progress.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    })
    
    return progress
  } catch (error) {
    console.error("Error getting user progress:", error)
    return null
  }
}

// Get all books the user is currently reading (has progress for)
export async function getCurrentlyReadingBooks(userId: string) {
  try {
    const reading = await prisma.progress.findMany({
      where: {
        userId,
      },
      include: {
        book: true,
      },
      orderBy: {
        lastRead: 'desc',
      },
      take: 5, // Limit to the 5 most recently read books
    })
    
    return reading
  } catch (error) {
    console.error("Error getting currently reading books:", error)
    return []
  }
}

// Update user's reading progress
export async function updateReadingProgress(userId: string, bookId: string, pageNumber: number) {
  try {
    const progress = await prisma.progress.upsert({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
      update: {
        currentPageNumber: pageNumber,
        // lastRead will be updated automatically due to @updatedAt
      },
      create: {
        userId,
        bookId,
        currentPageNumber: pageNumber,
      },
    })
    
    return progress
  } catch (error) {
    console.error("Error updating reading progress:", error)
    throw error
  }
}

// Add a bookmark
export async function addBookmark(userId: string, bookId: string, pageNumber: number, note?: string) {
  try {
    const bookmark = await prisma.bookmark.create({
      data: {
        userId,
        bookId,
        pageNumber,
        note,
      },
    })
    
    return bookmark
  } catch (error) {
    console.error("Error adding bookmark:", error)
    throw error
  }
}

// Get user's bookmarks for a specific book
export async function getUserBookmarks(userId: string, bookId: string) {
  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId,
        bookId,
      },
      orderBy: {
        pageNumber: 'asc',
      },
    })
    
    return bookmarks
  } catch (error) {
    console.error("Error getting user bookmarks:", error)
    return []
  }
}

// Calculate reading statistics for the user
export async function getUserReadingStats(userId: string) {
  try {
    // Get all user progress
    const allProgress = await prisma.progress.findMany({
      where: {
        userId,
      },
      include: {
        book: true,
      },
    })
    
    // Calculate total books started
    const totalBooksStarted = allProgress.length
    
    // Calculate books completed (where currentPageNumber >= book.totalPages)
    const booksCompleted = allProgress.filter(
      p => p.currentPageNumber >= p.book.totalPages
    ).length
    
    // Calculate total pages read (sum of currentPageNumber across all books)
    const totalPagesRead = allProgress.reduce(
      (sum, p) => sum + p.currentPageNumber, 0
    )
    
    // Calculate books read in the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const recentlyActive = allProgress.filter(
      p => p.lastRead >= thirtyDaysAgo
    ).length
    
    return {
      totalBooksStarted,
      booksCompleted,
      totalPagesRead,
      recentlyActive,
    }
  } catch (error) {
    console.error("Error calculating reading stats:", error)
    return {
      totalBooksStarted: 0,
      booksCompleted: 0,
      totalPagesRead: 0,
      recentlyActive: 0,
    }
  }
}
