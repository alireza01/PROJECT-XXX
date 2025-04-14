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
    const bookmarks = await supabase.from('bookmark').select('*').eq('user_id', userId).eq('book_id', bookId)
    return bookmarks
  } catch (error) {
    console.error("Error fetching bookmarks:", error)
    throw error
  }
}

export async function addBookmark(
  userId: string,
  bookId: string,
  pageId: string,
  note?: string
) {
  try {
    const bookmark = await supabase.from('bookmark').insert({
      user_id: userId,
      book_id: bookId,
      page_id: pageId,
      note: note,
      created_at: new Date().toISOString()
    }).select().single()
    return bookmark
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