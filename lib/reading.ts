import type { Database } from '@/types/supabase';

type ReadingProgress = Database['public']['Tables']['reading_progress']['Row'];

export const calculateProgress = (currentPage: number, totalPages: number): number => {
  return Math.round((currentPage / totalPages) * 100);
};

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export function formatLastReadTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  }
  
  return date.toLocaleDateString();
}

export const updateReadingProgress = async (
  bookId: string,
  currentPage: number,
  totalPages: number
): Promise<ReadingProgress> => {
  try {
    const response = await fetch('/api/reading/progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bookId,
        currentPage,
        totalPages,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update reading progress');
    }

    return response.json();
  } catch (error) {
    console.error('Error updating reading progress:', error);
    throw error;
  }
}; 