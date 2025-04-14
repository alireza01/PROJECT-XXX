import { supabase } from './supabase';

export interface Bookmark {
  id: string;
  user_id: string;
  book_id: string;
  page_number: number;
  created_at: string;
}

export async function getUserBookmarks(userId: string, bookId: string): Promise<{ data: Bookmark[] | null; error: any }> {
  return await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', userId)
    .eq('book_id', bookId);
}

export async function addBookmark(userId: string, bookId: string, pageNumber: number): Promise<{ data: Bookmark | null; error: any }> {
  return await supabase
    .from('bookmarks')
    .insert({
      user_id: userId,
      book_id: bookId,
      page_number: pageNumber
    })
    .select()
    .single();
}

export async function removeBookmark(userId: string, bookId: string, pageNumber: number): Promise<{ error: any }> {
  return await supabase
    .from('bookmarks')
    .delete()
    .match({ user_id: userId, book_id: bookId, page_number: pageNumber });
} 