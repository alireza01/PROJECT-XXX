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
      profiles: {
        Row: {
          id: string
          user_id: string
          username: string
          full_name: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          username: string
          full_name: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          username?: string
          full_name?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
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
          created_at?: string
          updated_at?: string
        }
      }
      vocabulary: {
        Row: {
          id: string
          word: string
          meaning: string
          explanation: string
          level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
          book_id: string
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          word: string
          meaning: string
          explanation: string
          level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
          book_id: string
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          word?: string
          meaning?: string
          explanation?: string
          level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
          book_id?: string
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Enums: {
      vocabulary_level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
    }
  }
} 