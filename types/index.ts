import { ReactNode } from 'react';

export type VocabularyLevel = "beginner" | "intermediate" | "advanced"

export interface Book {
  id: string
  title: string
  author: string
  content: string
  level: VocabularyLevel
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
  bookId: string;
  currentPage: number;
  totalPages: number;
  lastReadAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReadingSession {
  id: string;
  userId: string;
  bookId: string;
  startTime: string;
  endTime: string;
  pagesRead: number;
  duration: number;
  createdAt: string;
  updatedAt: string;
} 