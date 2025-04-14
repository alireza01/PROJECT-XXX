import { supabase } from './supabase';

// Get user's reading progress for a specific book
export async function getUserProgress(userId: string, bookId: string) {
  const { data: progress, error } = await supabase
    .from('reading_progress')
    .select('*')
    .eq('userId', userId)
    .eq('bookId', bookId)
    .single();

  if (error) throw error;
  return progress;
}

// Get all books the user is currently reading (has progress for)
export async function getUserReadingHistory(userId: string) {
  const { data: reading, error } = await supabase
    .from('reading_progress')
    .select('*, books(*)')
    .eq('userId', userId)
    .order('updatedAt', { ascending: false });

  if (error) throw error;
  return reading;
}

// Update user's reading progress
export async function updateReadingProgress(
  userId: string,
  bookId: string,
  progress: number
) {
  const { data, error } = await supabase
    .from('reading_progress')
    .upsert({
      userId,
      bookId,
      progress,
      updatedAt: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Add a bookmark
export async function createBookmark(
  userId: string,
  bookId: string,
  position: number
) {
  const { data, error } = await supabase
    .from('bookmarks')
    .insert([{
      userId,
      bookId,
      position,
      createdAt: new Date().toISOString(),
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Get user's bookmarks for a specific book
export async function getUserBookmarks(userId: string) {
  const { data: bookmarks, error } = await supabase
    .from('bookmarks')
    .select('*, books(*)')
    .eq('userId', userId)
    .order('createdAt', { ascending: false });

  if (error) throw error;
  return bookmarks;
}

// Delete a bookmark
export async function deleteBookmark(id: string) {
  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Calculate reading statistics for the user
export async function getAllUserProgress(userId: string) {
  const { data: allProgress, error } = await supabase
    .from('reading_progress')
    .select('*, books(*)')
    .eq('userId', userId);

  if (error) throw error;
  return allProgress;
}
