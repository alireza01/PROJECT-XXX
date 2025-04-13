"use server";

import prisma from '@/lib/prisma-client';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// Helper function to get authenticated user ID
async function getAuthenticatedUserId(): Promise<string> {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    console.error("Authentication error:", error?.message || "User not found");
    throw new Error("User not authenticated");
  }
  return user.id;
}

// --- Progress Actions ---

export async function getUserBookProgressAction(bookId: string) {
  try {
    const userId = await getAuthenticatedUserId();
    const progress = await prisma.progress.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    });
    return { success: true, data: progress };
  } catch (error: any) {
    console.error("Error getting user progress:", error.message);
    return { success: false, error: "Failed to get progress" };
  }
}

export async function getCurrentlyReadingBooksAction() {
  try {
    const userId = await getAuthenticatedUserId();
    const reading = await prisma.progress.findMany({
      where: {
        userId,
      },
      include: {
        book: {
          include: {
            author: true,
            category: true,
          },
        },
      },
      orderBy: {
        lastRead: 'desc',
      },
      take: 5,
    });
    return { success: true, data: reading };
  } catch (error: any) {
    console.error("Error getting currently reading books:", error.message);
    return { success: false, error: "Failed to get currently reading books", data: [] };
  }
}

export async function updateReadingProgressAction(bookId: string, pageNumber: number) {
  try {
    const userId = await getAuthenticatedUserId();
    
    // Get book total pages to calculate progress percentage
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      select: { totalPages: true }
    });

    if (!book) {
      return { success: false, error: "Book not found" };
    }

    const progressPercentage = Math.min(100, Math.round((pageNumber / book.totalPages) * 100));

    const progress = await prisma.progress.upsert({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
      update: {
        currentPageNumber: pageNumber,
        progress: progressPercentage,
      },
      create: {
        userId,
        bookId,
        currentPageNumber: pageNumber,
        progress: progressPercentage,
      },
    });

    // Revalidate the specific book reading page and the dashboard
    revalidatePath(`/books/${bookId}/read`);
    revalidatePath('/dashboard');

    return { success: true, data: progress };
  } catch (error: any) {
    console.error("Error updating reading progress:", error.message);
    return { success: false, error: "Failed to update progress" };
  }
}

// --- Bookmark Actions ---

export async function addBookmarkAction(bookId: string, pageNumber: number, note?: string) {
  try {
    const userId = await getAuthenticatedUserId();
    const bookmark = await prisma.bookmark.create({
      data: {
        userId,
        bookId,
        pageNumber,
        note,
      },
    });

    revalidatePath(`/books/${bookId}/read`);
    return { success: true, data: bookmark };
  } catch (error: any) {
    console.error("Error adding bookmark:", error.message);
    return { success: false, error: "Failed to add bookmark" };
  }
}

export async function getUserBookmarksAction(bookId: string) {
  try {
    const userId = await getAuthenticatedUserId();
    const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId,
        bookId,
      },
      orderBy: {
        pageNumber: 'asc',
      },
    });
    return { success: true, data: bookmarks };
  } catch (error: any) {
    console.error("Error getting user bookmarks:", error.message);
    return { success: false, error: "Failed to get bookmarks", data: [] };
  }
}

export async function deleteBookmarkAction(bookmarkId: string) {
  try {
    const userId = await getAuthenticatedUserId();

    const bookmark = await prisma.bookmark.findUnique({
      where: { id: bookmarkId },
      select: { userId: true, bookId: true }
    });

    if (!bookmark) {
      return { success: false, error: "Bookmark not found" };
    }

    if (bookmark.userId !== userId) {
      return { success: false, error: "Unauthorized to delete this bookmark" };
    }

    await prisma.bookmark.delete({
      where: { id: bookmarkId }
    });

    if (bookmark.bookId) {
      revalidatePath(`/books/${bookmark.bookId}/read`);
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting bookmark:", error.message);
    return { success: false, error: "Failed to delete bookmark" };
  }
}

// --- Stats Action ---

type ProgressWithBookPages = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  progress: number;
  userId: string;
  bookId: string;
  currentPageNumber: number;
  lastRead: Date;
  book: { totalPages: number } | null;
};

export async function getUserReadingStatsAction() {
  try {
    const userId = await getAuthenticatedUserId();

    const allProgress: ProgressWithBookPages[] = await prisma.progress.findMany({
      where: { userId },
      include: { book: { select: { totalPages: true } } },
    });

    const totalBooksStarted = allProgress.length;
    const booksCompleted = allProgress.filter(p =>
      p.book && typeof p.book.totalPages === 'number' && p.currentPageNumber >= p.book.totalPages
    ).length;
    const totalPagesRead = allProgress.reduce((sum, p) => sum + p.currentPageNumber, 0);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentlyActive = allProgress.filter(p => p.lastRead >= thirtyDaysAgo).length;

    const stats = {
      totalBooksStarted,
      booksCompleted,
      totalPagesRead,
      recentlyActive,
    };
    return { success: true, data: stats };

  } catch (error: any) {
    console.error("Error calculating reading stats:", error.message);
    const defaultStats = { totalBooksStarted: 0, booksCompleted: 0, totalPagesRead: 0, recentlyActive: 0 };
    return { success: false, error: "Failed to calculate stats", data: defaultStats };
  }
}