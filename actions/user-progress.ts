"use server";

import { PrismaClient, Progress } from '@prisma/client'; // Correct import for Prisma types/client
import prisma from '@lib/prisma-client'; // Correct import path assuming '@lib' alias
import { createClient } from '@lib/supabase/server'; // Correct import path assuming '@lib' alias
import { revalidatePath } from 'next/cache';

// Helper function to get authenticated user ID
async function getAuthenticatedUserId(): Promise<string> {
  const supabase = createClient(); // Correctly creates server client using cookies implicitly
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
    return { success: false, error: "Failed to get progress" }; // Simplified error message
  }
}

export async function getCurrentlyReadingBooksAction() {
  try {
    const userId = await getAuthenticatedUserId();
    // Fetch progress records including the related book data
    const reading = await prisma.progress.findMany({
      where: {
        userId,
      },
      include: {
        book: true, // Ensure 'book' relation exists in Prisma schema
      },
      orderBy: {
        lastRead: 'desc',
      },
      take: 5,
    });
    // Type assertion to ensure TS knows 'book' is included
    // Note: Prisma's generated types often handle this automatically if 'include' is used.
    // Explicit typing can be added if needed, e.g., Progress & { book: Book | null }[]
    return { success: true, data: reading };
  } catch (error: any) {
    console.error("Error getting currently reading books:", error.message);
    return { success: false, error: "Failed to get currently reading books", data: [] };
  }
}

export async function updateReadingProgressAction(bookId: string, pageNumber: number) {
  try {
    const userId = await getAuthenticatedUserId();
    const progress = await prisma.progress.upsert({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
      update: {
        currentPageNumber: pageNumber,
        // lastRead updates automatically via @updatedAt
      },
      create: {
        userId,
        bookId,
        currentPageNumber: pageNumber,
      },
    });

    // Revalidate the specific book reading page and the dashboard
    revalidatePath(`/books/${bookId}/read`); // Corrected path
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

    // Revalidate the specific book reading page
    revalidatePath(`/books/${bookId}/read`); // Corrected path

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

        // Find the bookmark first to get bookId for revalidation and verify ownership
        const bookmark = await prisma.bookmark.findUnique({
            where: { id: bookmarkId },
            select: { userId: true, bookId: true }
        });

        if (!bookmark) {
            return { success: false, error: "Bookmark not found" };
        }

        if (bookmark.userId !== userId) {
             // Although RLS should prevent this, an explicit check is good practice
            return { success: false, error: "Unauthorized to delete this bookmark" };
        }

        await prisma.bookmark.delete({
            where: {
                id: bookmarkId,
                // userId: userId // Can add for extra check if RLS isn't fully trusted/implemented
            },
        });

        // Revalidate the specific book reading page
        if (bookmark.bookId) {
             revalidatePath(`/books/${bookmark.bookId}/read`); // Corrected path
        }

        return { success: true };
    } catch (error: any) {
        console.error("Error deleting bookmark:", error.message);
        return { success: false, error: "Failed to delete bookmark" };
    }
}

// --- Stats Action ---

// Define a more specific type for progress including the expected book structure
type ProgressWithBookPages = Progress & {
    book: { totalPages: number } | null; // Allow null in case relation is optional or data missing
};

export async function getUserReadingStatsAction() {
  try {
    const userId = await getAuthenticatedUserId();

    const allProgress: ProgressWithBookPages[] = await prisma.progress.findMany({
      where: { userId },
      include: { book: { select: { totalPages: true } } },
    });

    const totalBooksStarted = allProgress.length;
    // Ensure book and totalPages exist before comparing
    const booksCompleted = allProgress.filter(p =>
        p.book && typeof p.book.totalPages === 'number' && p.currentPageNumber >= p.book.totalPages
    ).length;
    const totalPagesRead = allProgress.reduce((sum, p) => sum + p.currentPageNumber, 0);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    // Filter based on lastRead date
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
    // Provide default stats structure on error
    const defaultStats = { totalBooksStarted: 0, booksCompleted: 0, totalPagesRead: 0, recentlyActive: 0 };
    return { success: false, error: "Failed to calculate stats", data: defaultStats };
  }
}