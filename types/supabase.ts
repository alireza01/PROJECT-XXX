// @/types/supabase.ts
// This file defines the Supabase database types

import type { Database as DatabaseType } from '@/lib/database.types'

export type Tables<T extends keyof DatabaseType['public']['Tables']> = DatabaseType['public']['Tables'][T]['Row']
export type Enums<T extends keyof DatabaseType['public']['Enums']> = DatabaseType['public']['Enums'][T]

export type Profile = Tables<'profiles'>
export type Book = Tables<'books'> & {
  vocabulary?: string[];
  totalPages?: number;
}
export type Vocabulary = Tables<'vocabulary'>

export type UserRole = 'user' | 'admin' | 'moderator'
export type Theme = 'light' | 'dark' | 'system'
export type Language = 'en' | 'fa'

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      books: {
        Row: {
          id: string
          title: string
          author: string
          category: string
          level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
          content: string
          description: string | null
          publish_date: string | null
          page_count: number | null
          price: number | null
          discount: number | null
          meta_title: string | null
          meta_description: string | null
          cover_url: string | null
          file_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          author: string
          category: string
          level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
          content: string
          description?: string | null
          publish_date?: string | null
          page_count?: number | null
          price?: number | null
          discount?: number | null
          meta_title?: string | null
          meta_description?: string | null
          cover_url?: string | null
          file_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          author?: string
          category?: string
          level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
          content?: string
          description?: string | null
          publish_date?: string | null
          page_count?: number | null
          price?: number | null
          discount?: number | null
          meta_title?: string | null
          meta_description?: string | null
          cover_url?: string | null
          file_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      authors: {
        Row: {
          id: string
          name: string
          bio: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          bio?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          bio?: string | null
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
        }
      }
      vocabulary: {
        Row: {
          id: string
          word: string
          meaning: string
          explanation: string | null
          level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
          book_id: string
          created_by_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          word: string
          meaning: string
          explanation?: string | null
          level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
          book_id: string
          created_by_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          word?: string
          meaning?: string
          explanation?: string | null
          level?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
          book_id?: string
          created_by_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          role: "USER" | "ADMIN"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          avatar_url?: string | null
          role?: "USER" | "ADMIN"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          role?: "USER" | "ADMIN"
          created_at?: string
          updated_at?: string
        }
      }
      reading_progress: {
        Row: {
          id: string
          user_id: string
          book_id: string
          current_page: number
          completion_percentage: number
          last_read_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          book_id: string
          current_page: number
          completion_percentage: number
          last_read_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          book_id?: string
          current_page?: number
          completion_percentage?: number
          last_read_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      bookmarks: {
        Row: {
          id: string
          user_id: string
          book_id: string
          position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          book_id: string
          position: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          book_id?: string
          position?: number
          created_at?: string
          updated_at?: string
        }
      }
      likes: {
        Row: {
          id: string
          user_id: string
          book_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          book_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          book_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      highlights: {
        Row: {
          id: string
          user_id: string
          book_id: string
          content: string
          position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          book_id: string
          content: string
          position: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          book_id?: string
          content?: string
          position?: number
          created_at?: string
          updated_at?: string
        }
      }
      notes: {
        Row: {
          id: string
          user_id: string
          book_id: string
          content: string
          position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          book_id: string
          content: string
          position: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          book_id?: string
          content?: string
          position?: number
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string | null
          name: string | null
          image: string | null
          role: 'USER' | 'ADMIN'
          is_admin: boolean
          created_at: string
          last_login: string
        }
        Insert: {
          id: string
          email?: string | null
          name?: string | null
          image?: string | null
          role?: 'USER' | 'ADMIN'
          is_admin?: boolean
          created_at?: string
          last_login?: string
        }
        Update: {
          id?: string
          email?: string | null
          name?: string | null
          image?: string | null
          role?: 'USER' | 'ADMIN'
          is_admin?: boolean
          created_at?: string
          last_login?: string
        }
      }
      api_error_logs: {
        Row: {
          id: string
          api_key_id: string
          error: string
          status_code: number
          resolved: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          api_key_id: string
          error: string
          status_code: number
          resolved?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          api_key_id?: string
          error?: string
          status_code?: number
          resolved?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      api_keys: {
        Row: {
          id: string
          user_id: string
          key: string
          name: string
          is_active: boolean
          created_at: string
          last_used: string | null
        }
        Insert: {
          id?: string
          user_id: string
          key: string
          name: string
          is_active?: boolean
          created_at?: string
          last_used?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          key?: string
          name?: string
          is_active?: boolean
          created_at?: string
          last_used?: string | null
        }
      }
      book_tags: {
        Row: {
          id: string
          book_id: string
          tag: string
          created_at: string
        }
        Insert: {
          id?: string
          book_id: string
          tag: string
          created_at?: string
        }
        Update: {
          id?: string
          book_id?: string
          tag?: string
          created_at?: string
        }
      }
      gemini_api_keys: {
        Row: {
          id: string
          created_at: string
          user_id: string
          api_key: string
          is_public: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          api_key: string
          is_public?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          api_key?: string
          is_public?: boolean
        }
      }
      prompts: {
        Row: {
          id: string
          created_at: string
          user_id: string
          title: string
          content: string
          is_public: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          title: string
          content: string
          is_public?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          title?: string
          content?: string
          is_public?: boolean
        }
      }
      ai_interactions: {
        Row: {
          id: string
          created_at: string
          user_id: string
          prompt: string
          response: string
          model: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          prompt: string
          response: string
          model: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          prompt?: string
          response?: string
          model?: string
        }
      }
      reading_sessions: {
        Row: {
          id: string
          user_id: string
          book_id: string
          start_time: string
          end_time: string | null
          duration: number | null
          pages_read: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          book_id: string
          start_time: string
          end_time?: string | null
          duration?: number | null
          pages_read: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          book_id?: string
          start_time?: string
          end_time?: string | null
          duration?: number | null
          pages_read?: number
          created_at?: string
          updated_at?: string
        }
      }
      error_logs: {
        Row: {
          id: string
          user_id: string | null
          error: string
          stack_trace: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          error: string
          stack_trace?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          error?: string
          stack_trace?: string | null
          created_at?: string
        }
      }
      translation_prompts: {
        Row: {
          id: string
          user_id: string
          source_text: string
          target_language: string
          translated_text: string | null
          status: 'PENDING' | 'COMPLETED' | 'FAILED'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          source_text: string
          target_language: string
          translated_text?: string | null
          status?: 'PENDING' | 'COMPLETED' | 'FAILED'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          source_text?: string
          target_language?: string
          translated_text?: string | null
          status?: 'PENDING' | 'COMPLETED' | 'FAILED'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
