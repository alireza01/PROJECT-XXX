import { supabase } from "./supabase"

export async function updateReadingProgress(
  userId: string,
  bookId: string,
  pageId: string,
  progress: number
) {
  try {
    const { data, error } = await supabase
      .from('reading_progress')
      .upsert({
        user_id: userId,
        book_id: bookId,
        page_id: pageId,
        progress: progress,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating reading progress:', error)
    throw error
  }
}

export async function getUserBookmarks(userId: string, bookId: string) {
  try {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId)
      .eq('book_id', bookId)
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching bookmarks:", error)
    throw error
  }
}

export async function addBookmark(
  userId: string,
  bookId: string,
  pageNumber: string | number,
  note?: string
) {
  try {
    const { data, error } = await supabase
      .from('bookmarks')
      .insert({
        user_id: userId,
        book_id: bookId,
        page_number: typeof pageNumber === 'number' ? pageNumber.toString() : pageNumber,
        note: note,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error adding bookmark:", error)
    throw error
  }
}

export async function removeBookmark(bookmarkId: string) {
  try {
    await supabase.from('bookmark').delete().eq('id', bookmarkId)
  } catch (error) {
    console.error("Error removing bookmark:", error)
    throw error
  }
} 