// @/lib/data.ts
import { prisma } from "@/lib/prisma-client";
import { PrismaClient, type Book as PrismaBook, type Category as PrismaCategory } from '@prisma/client';
import { supabase } from "@/lib/supabase/client";
import { Book as BookType } from "@/types/book";

const prismaClient = new PrismaClient();

// Define ReadingLevel type locally based on schema
type ReadingLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

// Define types based on Prisma schema
export type Category = {
  id: string;
  name: string;
  slug: string;
  _count: {
    books: number;
  };
}

export type Book = {
  id: string;
  title: string;
  coverImage: string | null;
  rating: number | null;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    name: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

// Define where input type
type BookWhereInput = {
  category?: {
    slug?: string;
  };
  OR?: Array<{
    title?: { contains: string; mode: 'insensitive' };
    author?: { contains: string; mode: 'insensitive' };
  }>;
}

// Note: Most functions implicitly use types via Prisma return types.

// Helper functions for common database operations (migrated from v2/lib/db.ts)

export async function getTrendingBooks(limit = 6) {
  try {
    return await prisma.book.findMany({ // Changed from prisma.books
      take: limit,
      orderBy: {
        views: "desc",
      },
      include: {
        author: true,
        category: true,
      },
    });
  } catch (error) {
    console.error("Error fetching trending books:", error);
    // Consider returning an empty array or throwing a custom error
    return [];
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const categories = await prismaClient.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: { books: true },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return categories.map((category: { id: string; name: string; slug: string; _count: { books: number } }) => ({
      id: category.slug,
      name: category.name,
      slug: category.slug,
      _count: category._count,
    }));
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw error;
  }
}

export async function getBooksByCategory(slug: string, limit: number = 12, page: number = 1) {
  try {
    const skip = (page - 1) * limit;

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where: {
          category: {
            slug,
          },
        },
        select: {
          id: true,
          title: true,
          slug: true,
          coverImage: true,
          rating: true,
          author: true,
        },
        skip,
        take: limit,
        orderBy: {
          title: "asc",
        },
      }),
      prisma.book.count({
        where: {
          category: {
            slug,
          },
        },
      }),
    ]);

    return {
      items: books.map((book: { id: string; title: string; author: any; coverImage: string | null; rating: number | null }) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        coverImage: book.coverImage || "/images/book-placeholder.jpg",
        rating: book.rating || 0,
      })),
      total,
    };
  } catch (error) {
    console.error("Failed to fetch books:", error);
    throw error;
  }
}

export async function getUserReadingProgress(userId: string) {
  try {
    return await prisma.userProgress.findMany({
      where: {
        userId,
      },
      include: {
        book: { // Include necessary book details
          include: {
            author: true,
            category: true,
          }
        },
      },
      orderBy: {
        lastReadAt: "desc",
      },
      take: 5, // Consider if this limit is always appropriate
    });
  } catch (error) {
    console.error(`Error fetching reading progress for user ${userId}:`, error);
    return [];
  }
}

export async function getBookDetails(bookId: string) {
  try {
    return await prisma.book.findUnique({ // Changed from prisma.books
      where: {
        id: bookId,
      },
      include: {
        author: true,
        category: true,
        pages: { // Consider performance implications of fetching all pages
          orderBy: {
            pageNumber: "asc",
          },
          // select: { pageNumber: true } // Example: Select only specific fields if needed
        },
      },
    });
  } catch (error) {
    console.error(`Error fetching details for book ${bookId}:`, error);
    return null; // Return null or throw error if book not found/error occurs
  }
}

// Updated function signature to use the local ReadingLevel type
export async function getWordsByLevel(level: ReadingLevel, limit = 100) {
  try {
    return await prisma.word.findMany({ // Changed from prisma.words
      where: {
        level, // Prisma should accept the string literal type here
      },
      take: limit,
    });
  } catch (error) {
    console.error(`Error fetching words for level ${level}:`, error);
    return [];
  }
}

export async function getDashboardStats() {
  try {
    // Use Promise.all for concurrent counts
    const [userCount, bookCount, wordCount, activeReadingCount] = await Promise.all([
      prisma.user.count(), // Changed from prisma.users
      prisma.book.count(), // Changed from prisma.books
      prisma.word.count(), // Changed from prisma.words
      prisma.userProgress.count({
        where: {
          lastReadAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
      })
    ]);

    return {
      userCount,
      bookCount,
      wordCount,
      activeReadingCount,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    // Return default/zero values or throw
    return { userCount: 0, bookCount: 0, wordCount: 0, activeReadingCount: 0 };
  }
}

export async function getPopularBooks(limit = 5) {
  try {
    return await prisma.book.findMany({ // Changed from prisma.books
      take: limit,
      orderBy: {
        // Consider ordering by likes or bookmarks as well/instead?
        views: "desc",
      },
      include: {
        author: true,
        category: true, // Added category for potential display
        _count: {
          select: { likes: true, bookmarks: true }, // Count likes/bookmarks instead of progress
        },
      },
    });
  } catch (error) {
    console.error("Error fetching popular books:", error);
    return [];
  }
}

export async function getPopularWords(limit = 5) {
  try {
    return await prisma.word.findMany({ // Changed from prisma.words
      take: limit,
      orderBy: {
        searchCount: "desc", // Assuming searchCount reflects popularity
      },
    });
  } catch (error) {
    console.error("Error fetching popular words:", error);
    return [];
  }
}


// Get book page with associated word positions and word data
export async function getBookPageWithWords(bookId: string, pageNumber: number) {
   // Define return type for clarity, using the local ReadingLevel type
   type PageData = {
       pageNumber: number;
       content: string;
       words: Array<{
           id: string;
           word: string;
           meaning: string;
           level: ReadingLevel; // Use local string literal type
           startIndex: number;
           endIndex: number;
       }>;
   } | null; // Function can return null if page not found

  try {
    const page = await prisma.page.findUnique({
      where: {
        bookId_pageNumber: { bookId, pageNumber },
      },
      include: {
        wordPositions: {
          include: { word: true }, // Include the full word object
          orderBy: { startIndex: 'asc' },
        },
      },
    });

    if (!page) {
      console.warn(`Page ${pageNumber} not found for book ${bookId}`);
      return null;
    }

    // Map the data to the desired structure for the BookReader component
    // Define the type for 'position' inline
    return {
      pageNumber: page.pageNumber,
      content: page.content,
      words: page.wordPositions.map((position: {
          id: string; // from PageWordPosition itself
          startIndex: number;
          endIndex: number;
          // pageId: string; // other fields from PageWordPosition if needed
          // wordId: string;
          word: { // from the included Word relation
              id: string;
              word: string;
              meaning: string;
              level: ReadingLevel; // Use local type
              // Add other Word fields if needed (e.g., category, example)
          };
      }) => ({
        id: position.word.id,
        word: position.word.word,
        meaning: position.word.meaning,
        level: position.word.level, // Type should match now
        startIndex: position.startIndex,
        endIndex: position.endIndex,
      })),
    };
  } catch (error) {
      console.error(`Error fetching page ${pageNumber} for book ${bookId}:`, error);
      throw new Error(`Failed to fetch page data.`);
  }
}

export interface BookQueryParams {
  page?: number
  category?: string
  search?: string
  limit?: number
}

export interface BookQueryResult {
  books: BookType[]
  total: number
}

// This is a mock implementation. Replace with actual API calls in production.
export async function getBooks({
  page = 1,
  category,
  search,
  limit = 12,
}: BookQueryParams): Promise<BookQueryResult> {
  try {
    const skip = (page - 1) * limit;
    
    const where: BookWhereInput = {};
    
    if (category) {
      where.category = { slug: category };
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        include: {
          author: true,
          category: true,
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.book.count({ where }),
    ]);

    return {
      books: books.map((book: Book) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        category: book.category,
        coverImage: book.coverImage || '/images/book-placeholder.jpg',
        rating: book.rating || 0,
        createdAt: book.createdAt,
        updatedAt: book.updatedAt,
      })),
      total,
    };
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
}

export async function getCategory(slug: string): Promise<Category | null> {
  try {
    const category = await prismaClient.category.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: { books: true },
        },
      },
    });

    if (!category) return null;

    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      _count: category._count,
    };
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}
