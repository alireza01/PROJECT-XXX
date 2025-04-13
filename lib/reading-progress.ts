import { supabase } from "@/lib/supabase/client"
import { toast } from "sonner"

export interface ReadingProgress {
  id: string
  userId: string
  bookId: string
  currentPage: number
  totalPages: number
  progress: number
  lastReadAt: string
  createdAt: string
  updatedAt: string
}

export interface ReadingSession {
  id: string
  userId: string
  bookId: string
  startTime: string
  endTime: string | null
  pagesRead: number
  duration: number
  createdAt: string
  updatedAt: string
}

export async function getReadingProgress(userId: string, bookId: string): Promise<ReadingProgress | null> {
  try {
    const { data, error } = await supabase
      .from("reading_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("book_id", bookId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error getting reading progress:", error)
    toast.error("Failed to fetch reading progress")
    return null
  }
}

export async function updateReadingProgress(
  userId: string,
  bookId: string,
  currentPage: number,
  totalPages: number
): Promise<ReadingProgress | null> {
  try {
    const progress = (currentPage / totalPages) * 100

    const { data, error } = await supabase
      .from("reading_progress")
      .upsert({
        user_id: userId,
        book_id: bookId,
        current_page: currentPage,
        total_pages: totalPages,
        progress: progress,
        last_read_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error updating reading progress:", error)
    toast.error("Failed to update reading progress")
    return null
  }
}

export async function startReadingSession(
  userId: string,
  bookId: string
): Promise<ReadingSession | null> {
  try {
    const { data, error } = await supabase
      .from("reading_sessions")
      .insert({
        user_id: userId,
        book_id: bookId,
        start_time: new Date().toISOString(),
        pages_read: 0,
        duration: 0,
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error starting reading session:", error)
    toast.error("Failed to start reading session")
    return null
  }
}

export async function updateReadingSession(
  sessionId: string,
  pagesRead: number,
  duration: number
): Promise<ReadingSession | null> {
  try {
    const { data, error } = await supabase
      .from("reading_sessions")
      .update({
        pages_read: pagesRead,
        duration: duration,
        end_time: new Date().toISOString(),
      })
      .eq("id", sessionId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error updating reading session:", error)
    toast.error("Failed to update reading session")
    return null
  }
}

export async function getUserReadingStats(userId: string): Promise<{
  totalBooks: number
  totalPages: number
  readingTime: number
  streak: number
}> {
  try {
    // Get total books and pages
    const { data: progressData } = await supabase
      .from("reading_progress")
      .select("current_page")
      .eq("user_id", userId)

    const totalBooks = progressData?.length || 0
    const totalPages = progressData?.reduce((sum, item) => sum + (item.current_page || 0), 0) || 0

    // Get reading time
    const { data: sessionData } = await supabase
      .from("reading_sessions")
      .select("duration")
      .eq("user_id", userId)

    const readingTime = sessionData?.reduce((sum, session) => sum + (session.duration || 0), 0) || 0

    // Calculate streak
    const { data: lastSessions } = await supabase
      .from("reading_sessions")
      .select("created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(30)

    let streak = 0
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0]
      const hasReadingOnDate = lastSessions?.some(session => {
        const sessionDate = new Date(session.created_at)
        return sessionDate.toISOString().split('T')[0] === dateStr
      })

      if (!hasReadingOnDate) break

      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    }

    return {
      totalBooks,
      totalPages,
      readingTime,
      streak
    }
  } catch (error) {
    console.error("Error getting user reading stats:", error)
    toast.error("Failed to fetch reading stats")
    return {
      totalBooks: 0,
      totalPages: 0,
      readingTime: 0,
      streak: 0
    }
  }
}

export async function getBookReadingStats(bookId: string): Promise<{
  totalReaders: number
  averageProgress: number
  averageReadingTime: number
}> {
  try {
    // Get total readers and average progress
    const { data: progressData } = await supabase
      .from("reading_progress")
      .select("progress")
      .eq("book_id", bookId)

    const totalReaders = progressData?.length || 0
    const averageProgress = progressData?.reduce((sum, item) => sum + (item.progress || 0), 0) / totalReaders || 0

    // Get average reading time
    const { data: sessionData } = await supabase
      .from("reading_sessions")
      .select("duration")
      .eq("book_id", bookId)

    const totalReadingTime = sessionData?.reduce((sum, session) => sum + (session.duration || 0), 0) || 0
    const averageReadingTime = totalReadingTime / (sessionData?.length || 1)

    return {
      totalReaders,
      averageProgress,
      averageReadingTime
    }
  } catch (error) {
    console.error("Error getting book reading stats:", error)
    toast.error("Failed to fetch book reading stats")
    return {
      totalReaders: 0,
      averageProgress: 0,
      averageReadingTime: 0
    }
  }
}

export async function getRecentReadingSessions(
  userId: string,
  limit: number = 10
): Promise<ReadingSession[]> {
  try {
    const { data, error } = await supabase
      .from("reading_sessions")
      .select(`
        *,
        book:book_id(
          title,
          cover_url
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error getting recent reading sessions:", error)
    toast.error("Failed to fetch recent reading sessions")
    return []
  }
}

export async function getReadingHistory(
  userId: string,
  params?: {
    limit?: number
    offset?: number
    startDate?: string
    endDate?: string
  }
): Promise<ReadingSession[]> {
  try {
    let query = supabase
      .from("reading_sessions")
      .select(`
        *,
        book:book_id(
          title,
          cover_url
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (params?.startDate) {
      query = query.gte("created_at", params.startDate)
    }

    if (params?.endDate) {
      query = query.lte("created_at", params.endDate)
    }

    if (params?.limit) {
      query = query.limit(params.limit)
    }

    if (params?.offset) {
      query = query.offset(params.offset)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error getting reading history:", error)
    toast.error("Failed to fetch reading history")
    return []
  }
} 