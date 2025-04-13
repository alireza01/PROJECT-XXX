"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { prisma } from "./prisma-client"
import { getAuthSession } from "./auth"
import type { WordStatus } from "@prisma/client"

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

// Update reading progress
export async function updateReadingProgress(
  bookId: string,
  pageNumber: number,
  completionPercentage: number,
) {
  const session = await getAuthSession()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  try {
    // Check if progress record exists
    const existingProgress = await prisma.userProgress.findUnique({
      where: {
        userId_bookId: {
          userId: session.user.id,
          bookId,
        },
      },
    })

    if (existingProgress) {
      // Update existing progress
      await prisma.userProgress.update({
        where: {
          userId_bookId: {
            userId: session.user.id,
            bookId,
          },
        },
        data: {
          currentPage: pageNumber,
          completionPercentage,
          updatedAt: new Date(),
        },
      })
    } else {
      // Create new progress record
      await prisma.userProgress.create({
        data: {
          userId: session.user.id,
          bookId,
          currentPage: pageNumber,
          completionPercentage,
        },
      })
    }

    // Increment book views
    await prisma.book.update({
      where: { id: bookId },
      data: {
        views: {
          increment: 1,
        },
      },
    })

    revalidatePath(`/books/${bookId}/read`)
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error updating reading progress:", error)
    throw new Error("Failed to update reading progress")
  }
}

// Toggle bookmark
export async function toggleBookmark(bookId: string) {
  const session = await getAuthSession()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  try {
    // Check if bookmark exists
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_bookId: {
          userId: session.user.id,
          bookId,
        },
      },
    })

    if (existingBookmark) {
      // Remove bookmark
      await prisma.bookmark.delete({
        where: {
          userId_bookId: {
            userId: session.user.id,
            bookId,
          },
        },
      })
      revalidatePath(`/books/${bookId}`)
      revalidatePath("/dashboard")
      revalidatePath("/library")
      return { bookmarked: false }
    } else {
      // Add bookmark
      await prisma.bookmark.create({
        data: {
          userId: session.user.id,
          bookId,
        },
      })
      revalidatePath(`/books/${bookId}`)
      revalidatePath("/dashboard")
      revalidatePath("/library")
      return { bookmarked: true }
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error)
    throw new Error("Failed to toggle bookmark")
  }
}

// Toggle like
export async function toggleLike(bookId: string) {
  const session = await getAuthSession()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  try {
    // Check if like exists
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_bookId: {
          userId: session.user.id,
          bookId,
        },
      },
    })

    if (existingLike) {
      // Remove like
      await prisma.like.delete({
        where: {
          userId_bookId: {
            userId: session.user.id,
            bookId,
          },
        },
      })
      revalidatePath(`/books/${bookId}`)
      return { liked: false }
    } else {
      // Add like
      await prisma.like.create({
        data: {
          userId: session.user.id,
          bookId,
        },
      })
      revalidatePath(`/books/${bookId}`)
      return { liked: true }
    }
  } catch (error) {
    console.error("Error toggling like:", error)
    throw new Error("Failed to toggle like")
  }
}

// Get book page with words
export async function getBookPageWithWords(bookId: string, pageNumber: number) {
  try {
    const page = await prisma.page.findFirst({
      where: {
        bookId,
        pageNumber,
      },
      include: {
        wordPositions: {
          include: {
            word: true,
          },
        },
      },
    })

    if (!page) {
      throw new Error("Page not found")
    }

    return {
      id: page.id,
      content: page.content,
      pageNumber: page.pageNumber,
      words: page.wordPositions.map((w) => ({
        id: w.word.id,
        word: w.word.word,
        meaning: w.word.meaning,
        level: w.word.level,
        startIndex: w.startIndex,
        endIndex: w.endIndex,
      })),
    }
  } catch (error) {
    console.error("Error getting book page with words:", error)
    throw new Error("Failed to get book page with words")
  }
}

// Get book with current page
export async function getBookWithCurrentPage(bookId: string) {
  const session = await getAuthSession()
  const userId = session?.user?.id

  try {
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      include: {
        author: true,
        category: true,
        pages: {
          orderBy: { pageNumber: "asc" },
        },
        ...(userId
          ? {
              progress: {
                where: { userId },
              },
              bookmarks: {
                where: { userId },
              },
              likes: {
                where: { userId },
              },
            }
          : {}),
      },
    })

    if (!book) {
      throw new Error("Book not found")
    }

    // Get current page from reading progress or default to first page
    const currentPage =
      userId && book.progress?.[0]
        ? book.progress[0].currentPage
        : 1

    return {
      ...book,
      currentPage,
      isBookmarked: userId ? book.bookmarks?.[0] !== undefined : false,
      isLiked: userId ? book.likes?.[0] !== undefined : false,
    }
  } catch (error) {
    console.error("Error getting book with current page:", error)
    throw new Error("Failed to get book with current page")
  }
}

// Update word progress
export async function updateWordProgress(wordId: string, status: WordStatus) {
  const session = await getAuthSession()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  try {
    // Check if word progress exists
    const existingProgress = await prisma.userWordProgress.findUnique({
      where: {
        userId_wordId: {
          userId: session.user.id,
          wordId,
        },
      },
    })

    if (existingProgress) {
      // Update existing progress
      await prisma.userWordProgress.update({
        where: {
          userId_wordId: {
            userId: session.user.id,
            wordId,
          },
        },
        data: {
          status,
          updatedAt: new Date(),
        },
      })
    } else {
      // Create new progress record
      await prisma.userWordProgress.create({
        data: {
          userId: session.user.id,
          wordId,
          status,
        },
      })
    }

    revalidatePath("/vocabulary")
    return { success: true }
  } catch (error) {
    console.error("Error updating word progress:", error)
    throw new Error("Failed to update word progress")
  }
}

// Increment word search count
export async function incrementWordSearchCount(wordId: string) {
  try {
    await prisma.word.update({
      where: { id: wordId },
      data: {
        searchCount: {
          increment: 1,
        },
      },
    })
  } catch (error) {
    console.error("Error incrementing word search count:", error)
    throw new Error("Failed to increment word search count")
  }
} 