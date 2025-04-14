import { ReactNode } from 'react';
import type { Database } from './supabase';
export * from './vocabulary';

export type Tables = Database['public']['Tables'];
export type Enums = Database['public']['Enums'];

export type User = Tables['users']['Row'];
export type Book = Tables['books']['Row'];
export type ReadingProgress = Tables['reading_progress']['Row'];
export type Bookmark = Tables['bookmarks']['Row'];
export type Highlight = Tables['highlights']['Row'];
export type Note = Tables['notes']['Row'];
export type Vocabulary = Tables['vocabulary']['Row'];
export type ReadingSession = Tables['reading_sessions']['Row'];

export type VocabularyLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED"

// Helper types for common operations
export type UserWithProgress = User & {
  progress: ReadingProgress[];
  vocabulary_level: VocabularyLevel;
};

export type BookWithProgress = Book & {
  progress: ReadingProgress[];
  bookmarks: Bookmark[];
  highlights: Highlight[];
  notes: Note[];
};

export type VocabularyWithBook = Vocabulary & {
  book: Book;
};

// Vocabulary related types
export interface VocabularyStats {
  totalWords: number
  knownWords: number
  learningWords: number
  newWords: number
  currentLevel: VocabularyLevel
}

export interface WordPosition {
  word: string
  start: number
  end: number
  level: VocabularyLevel
}

export interface VocabularyTooltipProps {
  word: string
  level: VocabularyLevel
  position: { x: number; y: number }
  onClose: () => void
  userLevel: VocabularyLevel
}

export interface ReadingProgressProps {
  currentPage: number;
  totalPages: number;
}

export interface PageControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface ReadingSessionData {
  id: string;
  userId: string;
  user: User;
  bookId: string;
  book: Book;
  startTime: string;
  endTime: string;
  pagesRead: number;
  duration: number;
  createdAt: string;
  updatedAt: string;
}

// Prisma types
export type BookWithRelations = Book & {
  vocabulary: any[];
  createdBy: any;
};

export type ReadingProgressWithRelations = ReadingProgress & {
  user: any;
  book: any;
};

export type ReadingSessionWithRelations = ReadingSessionData & {
  user: any;
  book: any;
};

// Extended types for the reader components
export interface Chapter {
  id: string
  bookId: string
  title: string
  chapter_number: number
  page_number: number
  content?: string
}

export * from './book'
export * from './category'
export * from './translation'
export * from './supabase' 