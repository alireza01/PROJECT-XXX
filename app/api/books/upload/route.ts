import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
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

      const book = await prisma.book.create({
        data: {
          title,
          author: 'Unknown',
          content: path,
          totalPages: 0,
          createdById: session.user.id,
        },
      });

      return Response.json({ bookId: book.id });
    } else {
      // Handle text-based upload
      const { title, author, content } = await request.json();

      if (!title || !content) {
        return Response.json({ error: 'Missing required fields' }, { status: 400 });
      }

      const book = await prisma.book.create({
        data: {
          title,
          author: author || 'Unknown',
          content,
          totalPages: Math.ceil(content.length / 2000), // Rough estimate of pages
          createdById: session.user.id,
        },
      });

      return Response.json({ bookId: book.id });
    }
  } catch (error) {
    console.error('Error uploading book:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 