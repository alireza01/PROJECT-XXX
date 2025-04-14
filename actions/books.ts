import { supabase } from '@/lib/supabase'
import { Database } from '@/types/supabase'

export type Book = Database['public']['Tables']['books']['Row']
export type BookInsert = Database['public']['Tables']['books']['Insert']
export type BookUpdate = Database['public']['Tables']['books']['Update']

export async function addBook(data: BookInsert) {
  const { data: book, error } = await supabase
    .from('books')
    .insert(data)
    .select()
    .single()

  if (error) throw error
  return book
}

export async function updateBook(id: string, data: BookUpdate) {
  const { data: book, error } = await supabase
    .from('books')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return book
}

export async function deleteBook(id: string) {
  const { error } = await supabase
    .from('books')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function getBook(id: string) {
  const { data: book, error } = await supabase
    .from('books')
    .select('*, book_tags(*)')
    .eq('id', id)
    .single()

  if (error) throw error
  return book
}

export async function getBooks() {
  const { data: books, error } = await supabase
    .from('books')
    .select('*, book_tags(*)')
    .order('created_at', { ascending: false })

  if (error) throw error
  return books
}

export async function uploadBookCover(file: File) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `book-covers/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('books')
    .upload(filePath, file)

  if (uploadError) throw uploadError

  const { data: { publicUrl } } = supabase.storage
    .from('books')
    .getPublicUrl(filePath)

  return publicUrl
}

export async function uploadBookFile(file: File) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `book-files/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('books')
    .upload(filePath, file)

  if (uploadError) throw uploadError

  const { data: { publicUrl } } = supabase.storage
    .from('books')
    .getPublicUrl(filePath)

  return publicUrl
}

export async function addBookTags(bookId: string, tags: string[]) {
  const { error } = await supabase
    .from('book_tags')
    .insert(tags.map(tag => ({ book_id: bookId, tag })))

  if (error) throw error
} 