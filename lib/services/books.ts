import { supabase } from '../supabase';

export async function getBookById(id: string) {
  const { data: book, error } = await supabase
    .from('books')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return book;
}

export async function getBooksByCategory(categoryId: string) {
  const { data: books, error } = await supabase
    .from('books')
    .select('*')
    .eq('categoryId', categoryId);

  if (error) throw error;
  return books;
}

export async function getBooksByAuthor(authorId: string) {
  const { data: books, error } = await supabase
    .from('books')
    .select('*')
    .eq('authorId', authorId);

  if (error) throw error;
  return books;
}

export async function createBook(book: {
  title: string;
  description: string | null;
  coverImage: string | null;
  content: string;
  authorId: string;
  categoryId: string;
  userId: string;
}) {
  const { data, error } = await supabase
    .from('books')
    .insert([book])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateBook(id: string, updates: Partial<{
  title: string;
  description: string | null;
  coverImage: string | null;
  content: string;
  authorId: string;
  categoryId: string;
}>) {
  const { data, error } = await supabase
    .from('books')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBook(id: string) {
  const { error } = await supabase
    .from('books')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getBookContent(bookId: string): Promise<string> {
  const { data: book, error } = await supabase
    .from('books')
    .select('content')
    .eq('id', bookId)
    .single();

  if (error) throw error;
  return book.content;
} 