export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      authors: {
        Row: {
          id: number
          name: string
          bio: string | null
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          bio?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          bio?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      books: {
        Row: {
          id: number
          title: string
          slug: string
          description: string | null
          cover_image: string | null
          author_id: number | null
          category_id: number | null
          page_count: number | null
          level: string | null
          publish_date: string | null
          language: string | null
          price: number | null
          discount_percentage: number | null
          is_featured: boolean | null
          has_free_trial: boolean | null
          free_pages: number | null
          read_time: string | null
          file_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          slug: string
          description?: string | null
          cover_image?: string | null
          author_id?: number | null
          category_id?: number | null
          page_count?: number | null
          level?: string | null
          publish_date?: string | null
          language?: string | null
          price?: number | null
          discount_percentage?: number | null
          is_featured?: boolean | null
          has_free_trial?: boolean | null
          free_pages?: number | null
          read_time?: string | null
          file_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          slug?: string
          description?: string | null
          cover_image?: string | null
          author_id?: number | null
          category_id?: number | null
          page_count?: number | null
          level?: string | null
          publish_date?: string | null
          language?: string | null
          price?: number | null
          discount_percentage?: number | null
          is_featured?: boolean | null
          has_free_trial?: boolean | null
          free_pages?: number | null
          read_time?: string | null
          file_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      book_content: {
        Row: {
          id: number
          book_id: number
          chapter_number: number
          chapter_title: string
          content: string
          page_number: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          book_id: number
          chapter_number: number
          chapter_title: string
          content: string
          page_number: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          book_id?: number
          chapter_number?: number
          chapter_title?: string
          content?: string
          page_number?: number
          created_at?: string
          updated_at?: string
        }
      }
      book_tags: {
        Row: {
          book_id: number
          tag_id: number
        }
        Insert: {
          book_id: number
          tag_id: number
        }
        Update: {
          book_id?: number
          tag_id?: number
        }
      }
      categories: {
        Row: {
          id: number
          name: string
          slug: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          slug: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          slug?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      purchases: {
        Row: {
          id: number
          user_id: string
          book_id: number
          amount: number
          payment_status: string | null
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          book_id: number
          amount: number
          payment_status?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          book_id?: number
          amount?: number
          payment_status?: string | null
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: number
          book_id: number
          user_id: string
          rating: number | null
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          book_id: number
          user_id: string
          rating?: number | null
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          book_id?: number
          user_id?: string
          rating?: number | null
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tags: {
        Row: {
          id: number
          name: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          created_at?: string
        }
      }
      user_bookmarks: {
        Row: {
          id: number
          user_id: string
          book_id: number
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          book_id: number
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          book_id?: number
          created_at?: string
        }
      }
      user_highlights: {
        Row: {
          id: number
          user_id: string
          book_id: number
          page_number: number
          highlight_text: string
          highlight_color: string | null
          note: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          book_id: number
          page_number: number
          highlight_text: string
          highlight_color?: string | null
          note?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          book_id?: number
          page_number?: number
          highlight_text?: string
          highlight_color?: string | null
          note?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_likes: {
        Row: {
          id: number
          user_id: string
          book_id: number
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          book_id: number
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          book_id?: number
          created_at?: string
        }
      }
      user_progress: {
        Row: {
          id: number
          user_id: string
          book_id: number
          current_page: number | null
          completion_percentage: number | null
          last_read_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          book_id: number
          current_page?: number | null
          completion_percentage?: number | null
          last_read_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          book_id?: number
          current_page?: number | null
          completion_percentage?: number | null
          last_read_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      words: {
        Row: {
          id: number
          word: string
          translation: string
          explanation: string | null
          level: string | null
          example_sentence: string | null
          book_id: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          word: string
          translation: string
          explanation?: string | null
          level?: string | null
          example_sentence?: string | null
          book_id?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          word?: string
          translation?: string
          explanation?: string | null
          level?: string | null
          example_sentence?: string | null
          book_id?: number | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
