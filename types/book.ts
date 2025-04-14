import type { Database } from './supabase';

export type Book = Database['public']['Tables']['books']['Row'];
export type ReadingProgress = Database['public']['Tables']['reading_progress']['Row'];
export type Bookmark = Database['public']['Tables']['bookmarks']['Row'];
export type Highlight = Database['public']['Tables']['highlights']['Row'];
export type Note = Database['public']['Tables']['notes']['Row'];

export type BookWithRelations = Book & {
  progress: ReadingProgress[];
  bookmarks: Bookmark[];
  highlights: Highlight[];
  notes: Note[];
};

export type BookProgress = ReadingProgress;
export type BookBookmark = Bookmark;
export type BookHighlight = Highlight;
export type BookNote = Note;

// Extended Book type with pages property
export interface ExtendedBook extends Omit<Book, 'author'> {
  pages: number;
  authorName: string;
  author: string;
}

export interface ReadingSession {
  id: string;
  bookId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  pagesRead: number;
  duration?: number;
  created_at: string;
  updated_at: string;
} 