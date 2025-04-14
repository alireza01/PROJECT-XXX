export interface ReadingProgressProps {
  currentPage: number;
  totalPages: number;
}

export interface PageControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface ReadingSession {
  id: string;
  userId: string;
  bookId: string;
  startTime: string;
  endTime: string;
  pagesRead: number;
  duration: number;
  created_at: string;
  updated_at: string;
} 