// @/lib/data.ts
import { supabase } from "@/lib/supabase/client";
import type { Database } from '@/types/supabase';
import { Book as BookType } from "@/types/book";

// Define ReadingLevel type locally based on schema
type ReadingLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

// Define types based on Supabase schema
export type Category = Database['public']['Tables']['categories']['Row'] & {
  _count: {
    books: number;
  };
}

export type Book = Database['public']['Tables']['books']['Row'] & {
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

// Helper functions for common database operations

export async function getTrendingBooks(limit = 6) {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('*, author:author_id(*), category:category_id(*)')
      .order('views', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching trending books:", error);
    return [];
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, slug, books:books(count)')
      .order('name', { ascending: true });
    
    if (error) throw error;
    
    return (data || []).map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      created_at: new Date().toISOString(),
      _count: {
        books: category.books?.[0]?.count || 0
      }
    }));
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw error;
  }
}

export async function getBooksByCategory(slug: string, limit: number = 12, page: number = 1) {
  try {
    const skip = (page - 1) * limit;

    const [booksResponse, totalResponse] = await Promise.all([
      supabase
        .from('books')
        .select('id, title, slug, cover_url, author:author_id(*), category:category_id(*)')
        .eq('category.slug', slug)
        .order('title', { ascending: true })
        .range(skip, skip + limit - 1),
      supabase
        .from('books')
        .select('*', { count: 'exact', head: true })
        .eq('category.slug', slug)
    ]);

    if (booksResponse.error) throw booksResponse.error;
    if (totalResponse.error) throw totalResponse.error;

    return {
      items: (booksResponse.data || []).map((book) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        cover_url: book.cover_url || "/images/book-placeholder.jpg",
      })),
      total: totalResponse.count || 0,
    };
  } catch (error) {
    console.error("Failed to fetch books:", error);
    throw error;
  }
}

export async function getUserReadingProgress(userId: string) {
  try {
    return await supabase
      .from('reading_progress')
      .select('*, book:book_id(*), author:author_id(*), category:category_id(*)')
      .eq('user_id', userId)
      .order('last_read_at', { ascending: false })
      .limit(5);
  } catch (error) {
    console.error(`Error fetching reading progress for user ${userId}:`, error);
    return [];
  }
}

export async function getBookDetails(bookId: string) {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('*, author:author_id(*), category:category_id(*)')
      .eq('id', bookId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching details for book ${bookId}:`, error);
    return null;
  }
}

export async function getWordsByLevel(level: ReadingLevel, limit = 100) {
  try {
    const { data, error } = await supabase
      .from('vocabulary')
      .select('*')
      .eq('level', level)
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error fetching words for level ${level}:`, error);
    return [];
  }
}

export async function getDashboardStats() {
  try {
    const [userCount, bookCount, wordCount, activeReadingCount] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('books').select('*', { count: 'exact', head: true }),
      supabase.from('vocabulary').select('*', { count: 'exact', head: true }),
      supabase.from('reading_progress')
        .select('*', { count: 'exact', head: true })
        .gt('last_read_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    ]);

    return {
      userCount: userCount.count || 0,
      bookCount: bookCount.count || 0,
      wordCount: wordCount.count || 0,
      activeReadingCount: activeReadingCount.count || 0,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return { userCount: 0, bookCount: 0, wordCount: 0, activeReadingCount: 0 };
  }
}

export async function getPopularBooks(limit = 5) {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('*, author:author_id(*), category:category_id(*)')
      .order('views', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching popular books:", error);
    return [];
  }
}

export async function getPopularWords(limit = 5) {
  try {
    const { data, error } = await supabase
      .from('vocabulary')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching popular words:", error);
    return [];
  }
}

export async function getBookPageWithWords(bookId: string, pageNumber: number) {
  try {
    const { data: book, error: bookError } = await supabase
      .from('books')
      .select('*')
      .eq('id', bookId)
      .single();

    if (bookError) throw bookError;

    const { data: words, error: wordsError } = await supabase
      .from('vocabulary')
      .select('*')
      .eq('book_id', bookId)
      .order('created_at', { ascending: true });

    if (wordsError) throw wordsError;

    return {
      book,
      words: words || [],
    };
  } catch (error) {
    console.error(`Error fetching book page with words for book ${bookId}:`, error);
    return null;
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

export async function getBooks({
  page = 1,
  category,
  search,
  limit = 12,
}: BookQueryParams): Promise<BookQueryResult> {
  try {
    let query = supabase
      .from('books')
      .select('*, author:author_id(*), category:category_id(*)', { count: 'exact' });

    if (category) {
      query = query.eq('category.slug', category);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,author.name.ilike.%${search}%`);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) throw error;

    return {
      books: data || [],
      total: count || 0,
    };
  } catch (error) {
    console.error("Error fetching books:", error);
    return { books: [], total: 0 };
  }
}

export async function getCategory(slug: string): Promise<Category | null> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, slug, books:books(count)')
      .eq('slug', slug)
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      created_at: new Date().toISOString(),
      _count: {
        books: data.books?.[0]?.count || 0
      }
    };
  } catch (error) {
    console.error(`Error fetching category ${slug}:`, error);
    return null;
  }
}
