import { ReactNode } from 'react';
import type { Prisma } from '@prisma/client';

export type VocabularyLevel = "beginner" | "intermediate" | "advanced"

export interface Book {
  id: string
  title: string
  author: string
  content: string
  level: VocabularyLevel
  coverImage?: string
  totalPages: number
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  name: string
  level: VocabularyLevel
  progress: {
    booksRead: number
    wordsLearned: number
  }
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

export interface ReadingProgress {
  id: string;
  userId: string;
  user: User;
  bookId: string;
  book: Book;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReadingSession {
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

export type ReadingSessionWithRelations = ReadingSession & {
  user: any;
  book: any;
}; 