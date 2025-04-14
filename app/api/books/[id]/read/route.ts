import { NextResponse } from "next/server"
import { getAuthSession } from "@/lib/auth"
import { supabase } from "@/lib/supabase/client"
import { getBookPageWithWords } from "@/lib/data"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const pageNumber = Number(searchParams.get("page") || "1")

    // Get book details
    const { data: book, error: bookError } = await supabase
      .from('books')
      .select(`
        id,
        title,
        page_count,
        authors (
          name
        )
      `)
      .eq('id', params.id)
      .single()

    if (bookError || !book) {
      return Response.json({ error: "Book not found" }, { status: 404 })
    }

    // Get current user
    const session = await getAuthSession()
    const userId = session?.user?.id || "anonymous"

    // Get user progress if logged in
    let currentPage = pageNumber
    if (session?.user) {
      const { data: progress } = await supabase
        .from('user_progress')
        .select('current_page')
        .eq('user_id', session.user.id)
        .eq('book_id', book.id)
        .single()

      if (progress && !searchParams.has("page")) {
        currentPage = progress.current_page
      }
    }

    // Get page content with words
    let pageContent
    try {
      pageContent = await getBookPageWithWords(book.id, currentPage)
    } catch (error) {
      // If page not found, default to page 1
      if (currentPage !== 1) {
        pageContent = await getBookPageWithWords(book.id, 1)
        currentPage = 1
      } else {
        // If still not found, create a default page
        pageContent = {
          pageNumber: 1,
          content: "محتوای این صفحه در دسترس نیست.",
          words: [],
        }
      }
    }

    // Check if book is bookmarked
    let isBookmarked = false
    if (session?.user) {
      const { data: bookmark } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('book_id', book.id)
        .single()
      
      isBookmarked = !!bookmark
    }

    return Response.json({
      book: {
        id: book.id,
        title: book.title,
        author: Array.isArray(book.authors) ? book.authors[0]?.name : 'Unknown Author',
        totalPages: book.page_count,
      },
      currentPage,
      pageContent,
      isBookmarked,
      userId,
    })
  } catch (error) {
    console.error("Error fetching book page:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
