import { supabase } from "@/lib/supabase/client"
import { toast } from "sonner"

export interface Book {
  id: string
  title: string
  slug: string
  description: string | null
  coverUrl: string | null
  fileUrl: string | null
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
  pageCount: number
  rating: number
  readingTime: number
  authorId: string
  categoryId: string
  author: {
    name: string
  }
  category: {
    name: string
  }
  createdAt: string
  updatedAt: string
}

export interface CreateBookInput {
  title: string
  slug: string
  description?: string
  coverUrl?: string
  fileUrl?: string
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
  pageCount: number
  authorId: string
  categoryId: string
}

export interface UpdateBookInput {
  title?: string
  slug?: string
  description?: string
  coverUrl?: string
  fileUrl?: string
  level?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
  pageCount?: number
  authorId?: string
  categoryId?: string
}

export async function getBooks(params?: {
  limit?: number
  offset?: number
  category?: string
  level?: string
  search?: string
}): Promise<Book[]> {
  try {
    let query = supabase
      .from("books")
      .select(`
        *,
        author:author_id(name),
        category:category_id(name)
      `)
      .order("created_at", { ascending: false })

    if (params?.category) {
      query = query.eq("category.name", params.category)
    }

    if (params?.level) {
      query = query.eq("level", params.level)
    }

    if (params?.search) {
      query = query.or(`title.ilike.%${params.search}%,description.ilike.%${params.search}%`)
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
    console.error("Error getting books:", error)
    toast.error("Failed to fetch books")
    return []
  }
}

export async function getBookById(id: string): Promise<Book | null> {
  try {
    const { data, error } = await supabase
      .from("books")
      .select(`
        *,
        author:author_id(name),
        category:category_id(name)
      `)
      .eq("id", id)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error getting book by ID:", error)
    toast.error("Failed to fetch book")
    return null
  }
}

export async function getBookBySlug(slug: string): Promise<Book | null> {
  try {
    const { data, error } = await supabase
      .from("books")
      .select(`
        *,
        author:author_id(name),
        category:category_id(name)
      `)
      .eq("slug", slug)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error getting book by slug:", error)
    toast.error("Failed to fetch book")
    return null
  }
}

export async function createBook(input: CreateBookInput): Promise<Book | null> {
  try {
    const { data, error } = await supabase
      .from("books")
      .insert({
        ...input,
        rating: 0,
        readingTime: 0,
      })
      .select(`
        *,
        author:author_id(name),
        category:category_id(name)
      `)
      .single()

    if (error) throw error
    toast.success("Book created successfully")
    return data
  } catch (error) {
    console.error("Error creating book:", error)
    toast.error("Failed to create book")
    return null
  }
}

export async function updateBook(id: string, input: UpdateBookInput): Promise<Book | null> {
  try {
    const { data, error } = await supabase
      .from("books")
      .update(input)
      .eq("id", id)
      .select(`
        *,
        author:author_id(name),
        category:category_id(name)
      `)
      .single()

    if (error) throw error
    toast.success("Book updated successfully")
    return data
  } catch (error) {
    console.error("Error updating book:", error)
    toast.error("Failed to update book")
    return null
  }
}

export async function deleteBook(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("books")
      .delete()
      .eq("id", id)

    if (error) throw error
    toast.success("Book deleted successfully")
    return true
  } catch (error) {
    console.error("Error deleting book:", error)
    toast.error("Failed to delete book")
    return false
  }
}

export async function uploadBookCover(file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split(".").pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `book-covers/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from("book-covers")
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from("book-covers")
      .getPublicUrl(filePath)

    return publicUrl
  } catch (error) {
    console.error("Error uploading book cover:", error)
    toast.error("Failed to upload book cover")
    return null
  }
}

export async function uploadBookFile(file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split(".").pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `book-files/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from("book-files")
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from("book-files")
      .getPublicUrl(filePath)

    return publicUrl
  } catch (error) {
    console.error("Error uploading book file:", error)
    toast.error("Failed to upload book file")
    return null
  }
}

export async function getBookContent(bookId: string): Promise<string | null> {
  try {
    const { data: book } = await supabase
      .from("books")
      .select("fileUrl")
      .eq("id", bookId)
      .single()

    if (!book?.fileUrl) return null

    const { data, error } = await supabase.storage
      .from("book-files")
      .download(book.fileUrl)

    if (error) throw error

    return await data.text()
  } catch (error) {
    console.error("Error getting book content:", error)
    toast.error("Failed to fetch book content")
    return null
  }
}

export async function updateBookContent(bookId: string, content: string): Promise<boolean> {
  try {
    const { data: book } = await supabase
      .from("books")
      .select("fileUrl")
      .eq("id", bookId)
      .single()

    if (!book?.fileUrl) return false

    const { error } = await supabase.storage
      .from("book-files")
      .update(book.fileUrl, content)

    if (error) throw error

    return true
  } catch (error) {
    console.error("Error updating book content:", error)
    toast.error("Failed to update book content")
    return false
  }
} 