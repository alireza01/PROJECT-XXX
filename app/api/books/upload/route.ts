import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { supabase } from '@/lib/supabase'; // Assuming supabase is exported from here
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contentType = request.headers.get('content-type');
    
    if (contentType?.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await request.formData();
      const file = formData.get('file') as File;
      const title = formData.get('title') as string;

      if (!file || !title) {
        return Response.json({ error: 'Missing required fields' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${Date.now()}-${file.name}`;
      const path = join(process.cwd(), 'public', 'uploads', 'books', fileName);
      await writeFile(path, buffer);

      // Upload file to Supabase Storage
      const { data: fileData, error: uploadError } = await supabase.storage
        .from('books')
        .upload(fileName, buffer, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Create book record in Supabase
      const { data: book, error: bookError } = await supabase
        .from('books')
        .insert({
          title,
          author: 'Unknown',
          content_path: fileData.path,
          total_pages: 0,
          created_by: session.user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (bookError) {
        throw bookError;
      }

      return Response.json({ bookId: book.id });
    } else {
      // Handle text-based upload
      const { title, author, content } = await request.json();

      if (!title || !content) {
        return Response.json({ error: 'Missing required fields' }, { status: 400 });
      }

      // Create book record in Supabase
      const { data: book, error: bookError } = await supabase
        .from('books')
        .insert({
          title,
          author: author || 'Unknown',
          content,
          total_pages: Math.ceil(content.length / 2000), // Rough estimate of pages
          created_by: session.user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (bookError) {
        throw bookError;
      }

      return Response.json({ bookId: book.id });
    }
  } catch (error) {
    console.error('Error uploading book:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 