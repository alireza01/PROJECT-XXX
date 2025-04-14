export type VocabularyLevel = "beginner" | "intermediate" | "advanced"

export interface VocabularyStats {
  totalWords: number;
  wordsByLevel: {
    [key in VocabularyLevel]: number;
  };
  lastUpdated: string;
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

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  level: VocabularyLevel;
  content: string;
  description: string | null;
  publish_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface VocabularyItem {
  id: string;
  word: string;
  meaning: string;
  explanation: string;
  level: VocabularyLevel;
  book_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
} 