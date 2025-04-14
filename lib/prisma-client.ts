// @/lib/prisma-client.ts
// This file replaces Prisma with Supabase for database operations
import { supabase } from './supabase/client'
import type { Database } from '@/types/supabase'

// Define types based on Supabase schema
export type Book = Database['public']['Tables']['books']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Author = Database['public']['Tables']['authors']['Row']
export type Vocabulary = Database['public']['Tables']['vocabulary']['Row']
export type User = Database['public']['Tables']['users']['Row']
export type UserProgress = Database['public']['Tables']['reading_progress']['Row']
export type Bookmark = Database['public']['Tables']['bookmarks']['Row']
export type Like = Database['public']['Tables']['likes']['Row']
export type Level = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
export type ApiErrorLog = Database['public']['Tables']['api_error_logs']['Row']

// Define a simpler type for options to avoid deep type instantiation
type PrismaOptions = {
  where?: Record<string, any>
  include?: Record<string, any>
  select?: Record<string, any>
  orderBy?: Record<string, any>
  skip?: number
  take?: number
  data?: Record<string, any>
  create?: Record<string, any>
  update?: Record<string, any>
}

// Create a prisma-like interface for Supabase
export const prisma = {
  // Books
  book: {
    findMany: async (options: PrismaOptions = {}) => {
      let query = supabase.from('books').select('*, authors(*), categories(*)')
      
      if (options.where) {
        if (options.where.id) {
          query = query.eq('id', options.where.id)
        }
        if (options.where.category?.slug) {
          query = query.eq('category_id', options.where.category.slug)
        }
        if (options.where.OR) {
          // Handle OR conditions
          const orConditions = options.where.OR.map((condition: any) => {
            if (condition.title?.contains) {
              return `title.ilike.%${condition.title.contains}%`
            }
            if (condition.author?.contains) {
              return `author_id.ilike.%${condition.author.contains}%`
            }
            return null
          }).filter(Boolean)
          
          if (orConditions.length > 0) {
            query = query.or(orConditions.join(','))
          }
        }
      }
      
      if (options.include) {
        // Include is handled by the select statement above
      }
      
      if (options.skip) {
        query = query.range(options.skip, options.skip + (options.take || 10) - 1)
      } else if (options.take) {
        query = query.limit(options.take)
      }
      
      if (options.orderBy) {
        const [field, direction] = Object.entries(options.orderBy)[0]
        query = query.order(field, { ascending: direction === 'asc' })
      }
      
      const { data, error } = await query
      
      return data
    },
    
    findUnique: async (options: PrismaOptions) => {
      const { data, error } = await supabase
        .from('books')
        .select('*, authors(*), categories(*)')
        .eq('id', options.where?.id)
        .single()
      
      if (error) throw error
      return data
    },
    
    create: async (options: PrismaOptions) => {
      const { data, error } = await supabase
        .from('books')
        .insert(options.data || {})
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    
    update: async (options: PrismaOptions) => {
      const { data, error } = await supabase
        .from('books')
        .update(options.data || {})
        .eq('id', options.where?.id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    
    delete: async (options: PrismaOptions) => {
      const { data, error } = await supabase
        .from('books')
        .delete()
        .eq('id', options.where?.id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    
    count: async (options: PrismaOptions = {}) => {
      let query = supabase.from('books').select('id', { count: 'exact' })
      
      if (options.where) {
        if (options.where.category?.slug) {
          query = query.eq('category_id', options.where.category.slug)
        }
        if (options.where.OR) {
          // Handle OR conditions similar to findMany
          const orConditions = options.where.OR.map((condition: any) => {
            if (condition.title?.contains) {
              return `title.ilike.%${condition.title.contains}%`
            }
            if (condition.author?.contains) {
              return `author_id.ilike.%${condition.author.contains}%`
            }
            return null
          }).filter(Boolean)
          
          if (orConditions.length > 0) {
            query = query.or(orConditions.join(','))
          }
        }
      }
      
      const { count, error } = await query
      if (error) throw error
      return count || 0
    }
  },
  
  // Vocabulary
  vocabulary: {
    findMany: async (options: PrismaOptions = {}) => {
      let query = supabase.from('vocabulary').select('*')
      
      if (options.where) {
        if (options.where.bookId) {
          query = query.eq('book_id', options.where.bookId)
        }
        if (options.where.level) {
          query = query.eq('level', options.where.level)
        }
      }
      
      if (options.take) {
        query = query.limit(options.take)
      }
      
      if (options.orderBy) {
        const [field, direction] = Object.entries(options.orderBy)[0]
        query = query.order(field, { ascending: direction === 'asc' })
      }
      
      const { data, error } = await query
      if (error) throw error
      return data
    },
    
    findUnique: async (options: PrismaOptions) => {
      const { data, error } = await supabase
        .from('vocabulary')
        .select('*')
        .eq('id', options.where?.id)
        .single()
      
      if (error) throw error
      return data
    },
    
    create: async (options: PrismaOptions) => {
      const { data, error } = await supabase
        .from('vocabulary')
        .insert(options.data || {})
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    
    update: async (options: PrismaOptions) => {
      const { data, error } = await supabase
        .from('vocabulary')
        .update(options.data || {})
        .eq('id', options.where?.id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    
    delete: async (options: PrismaOptions) => {
      const { data, error } = await supabase
        .from('vocabulary')
        .delete()
        .eq('id', options.where?.id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    
    count: async (options: PrismaOptions = {}) => {
      let query = supabase.from('vocabulary').select('id', { count: 'exact' })
      
      if (options.where) {
        if (options.where.bookId) {
          query = query.eq('book_id', options.where.bookId)
        }
        if (options.where.level) {
          query = query.eq('level', options.where.level)
        }
      }
      
      const { count, error } = await query
      if (error) throw error
      return count || 0
    }
  },
  
  // User
  user: {
    findMany: async (options: PrismaOptions = {}) => {
      let query = supabase.from('users').select('*')
      
      if (options.take) {
        query = query.limit(options.take)
      }
      
      if (options.orderBy) {
        const [field, direction] = Object.entries(options.orderBy)[0]
        query = query.order(field, { ascending: direction === 'asc' })
      }
      
      const { data, error } = await query
      if (error) throw error
      return data
    },
    
    findUnique: async (options: PrismaOptions) => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', options.where?.id)
        .single()
      
      if (error) throw error
      return data
    },
    
    count: async (options: PrismaOptions = {}) => {
      const { count, error } = await supabase
        .from('users')
        .select('id', { count: 'exact' })
      
      if (error) throw error
      return count || 0
    }
  },
  
  // User Progress
  userProgress: {
    findMany: async (options: PrismaOptions = {}) => {
      let query = supabase.from('reading_progress').select('*, books(*)')
      
      if (options.where) {
        if (options.where.userId) {
          query = query.eq('user_id', options.where.userId)
        }
        if (options.where.bookId) {
          query = query.eq('book_id', options.where.bookId)
        }
      }
      
      if (options.orderBy) {
        const [field, direction] = Object.entries(options.orderBy)[0]
        query = query.order(field, { ascending: direction === 'asc' })
      }
      
      if (options.take) {
        query = query.limit(options.take)
      }
      
      const { data, error } = await query
      if (error) throw error
      return data
    },
    
    findUnique: async (options: PrismaOptions) => {
      const { data, error } = await supabase
        .from('reading_progress')
        .select('*, books(*)')
        .eq('user_id', options.where?.userId_bookId?.userId)
        .eq('book_id', options.where?.userId_bookId?.bookId)
        .single()
      
      if (error) throw error
      return data
    },
    
    create: async (options: PrismaOptions) => {
      const { data, error } = await supabase
        .from('reading_progress')
        .insert(options.data || {})
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    
    update: async (options: PrismaOptions) => {
      const { data, error } = await supabase
        .from('reading_progress')
        .update(options.data || {})
        .eq('user_id', options.where?.userId_bookId?.userId)
        .eq('book_id', options.where?.userId_bookId?.bookId)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    
    upsert: async (options: PrismaOptions) => {
      const { data, error } = await supabase
        .from('reading_progress')
        .upsert(options.create || {})
        .select()
        .single()
      
      if (error) throw error
      return data
    }
  },
  
  // Bookmarks
  bookmark: {
    findMany: async (options: PrismaOptions) => {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', options.where?.userId)
        .eq('book_id', options.where?.bookId)
      if (error) throw error
      return data
    },
    findUnique: async (options: PrismaOptions) => {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', options.where?.userId_bookId?.userId)
        .eq('book_id', options.where?.userId_bookId?.bookId)
        .single()
      if (error) throw error
      return data
    },
    create: async (options: PrismaOptions) => {
      const { data, error } = await supabase
        .from('bookmarks')
        .insert(options.data || {})
        .select()
        .single()
      if (error) throw error
      return data
    },
    delete: async (options: PrismaOptions) => {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', options.where?.userId)
        .eq('book_id', options.where?.bookId)
      if (error) throw error
    },
    deleteMany: async (options: PrismaOptions) => {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', options.where?.userId)
        .eq('book_id', options.where?.bookId)
      if (error) throw error
    },
    upsert: async (options: PrismaOptions) => {
      const { data, error } = await supabase
        .from('bookmarks')
        .upsert(options.create || {}, {
          onConflict: 'user_id,book_id'
        })
        .select()
        .single()
      if (error) throw error
      return data
    }
  },
  
  // Likes
  like: {
    findMany: async (options: PrismaOptions = {}) => {
      let query = supabase.from('likes').select('*')
      
      if (options.where) {
        if (options.where.userId) {
          query = query.eq('user_id', options.where.userId)
        }
        if (options.where.bookId) {
          query = query.eq('book_id', options.where.bookId)
        }
      }
      
      const { data, error } = await query
      if (error) throw error
      return data
    },
    
    findUnique: async (options: PrismaOptions) => {
      const { data, error } = await supabase
        .from('likes')
        .select('*')
        .eq('user_id', options.where?.userId_bookId?.userId)
        .eq('book_id', options.where?.userId_bookId?.bookId)
        .single()
      
      if (error) throw error
      return data
    },
    
    create: async (options: PrismaOptions) => {
      const { data, error } = await supabase
        .from('likes')
        .insert(options.data || {})
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    
    delete: async (options: PrismaOptions) => {
      const { data, error } = await supabase
        .from('likes')
        .delete()
        .eq('user_id', options.where?.userId_bookId?.userId)
        .eq('book_id', options.where?.userId_bookId?.bookId)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    
    deleteMany: async (options: PrismaOptions) => {
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('user_id', options.where?.userId)
        .eq('book_id', options.where?.bookId)
      if (error) throw error
    },
    
    upsert: async (options: PrismaOptions) => {
      const { data, error } = await supabase
        .from('likes')
        .upsert(options.create || {}, {
          onConflict: 'user_id,book_id'
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    }
  },
  
  // Categories
  category: {
    findMany: async (options: PrismaOptions = {}) => {
      let query = supabase.from('categories').select('*')
      
      if (options.where) {
        if (options.where.id) {
          query = query.eq('id', options.where.id)
        }
        if (options.where.slug) {
          query = query.eq('slug', options.where.slug)
        }
      }
      
      if (options.select) {
        // Handle select with _count
        if (options.select._count) {
          query = supabase.from('categories')
            .select('id, name, slug, books:books(count)')
        }
      }
      
      if (options.orderBy) {
        const [field, direction] = Object.entries(options.orderBy)[0]
        query = query.order(field, { ascending: direction === 'asc' })
      }
      
      const { data, error } = await query
      if (error) throw error
      
      // Transform data if needed for _count
      if (options.select?._count) {
        return data.map((category: any) => ({
          id: category.id,
          name: category.name,
          slug: category.slug,
          _count: {
            books: category.books?.[0]?.count || 0
          }
        }))
      }
      
      return data
    },
    
    findUnique: async (options: PrismaOptions) => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', options.where?.slug)
        .single()
      
      if (error) throw error
      return data
    },
    
    count: async (options: PrismaOptions = {}) => {
      const { count, error } = await supabase
        .from('categories')
        .select('id', { count: 'exact' })
      
      if (error) throw error
      return count || 0
    }
  },
  
  apiErrorLog: {
    findMany: async (options: PrismaOptions = {}) => {
      let query = supabase.from('api_error_logs').select('*, api_keys(*)')
      
      if (options.where) {
        if (options.where.id) {
          query = query.eq('id', options.where.id)
        }
        if (options.where.apiKeyId) {
          query = query.eq('api_key_id', options.where.apiKeyId)
        }
        if (options.where.apiKey?.OR) {
          const orConditions = options.where.apiKey.OR.map((condition: any) => {
            if (condition.userId) {
              return `api_keys.user_id.eq.${condition.userId}`
            }
            return null
          }).filter(Boolean)
          
          if (orConditions.length > 0) {
            query = query.or(orConditions.join(','))
          }
        }
      }
      
      if (options.include) {
        // Include is handled by the select statement above
      }
      
      if (options.orderBy) {
        const [field, direction] = Object.entries(options.orderBy)[0]
        query = query.order(field, { ascending: direction === 'asc' })
      }
      
      const { data, error } = await query
      if (error) throw error
      return data
    },
    
    create: async (options: PrismaOptions) => {
      const { data, error } = await supabase
        .from('api_error_logs')
        .insert(options.data || {})
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    
    update: async (options: PrismaOptions) => {
      const { data, error } = await supabase
        .from('api_error_logs')
        .update(options.data || {})
        .eq('id', options.where?.id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
  }
} 