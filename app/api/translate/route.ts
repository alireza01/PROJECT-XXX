import { NextResponse } from 'next/server';
import type { NextResponse as NextResponseType } from 'next/server';
import { translateText } from '@/lib/services/translation';
import { getBookContent } from '@/lib/services/books';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { bookId, selectedText, targetLanguage = 'English' } = await request.json();

    if (!bookId || !selectedText) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get book metadata and content
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      select: {
        title: true,
        author: true,
        content: true,
      },
    });

    if (!book) {
      return Response.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    // Extract the content as string
    const bookContent = typeof book.content === 'string' ? book.content : '';
    const bookTitle = typeof book.title === 'string' ? book.title : '';
    const bookAuthor = typeof book.author === 'string' ? book.author : '';

    // Translate the text with context
    const translation = await translateText(
      selectedText,
      targetLanguage,
      'auto'
    );

    return Response.json(translation);
  } catch (error) {
    console.error('Translation API error:', error);
    return Response.json(
      { error: 'Failed to translate text' },
      { status: 500 }
    );
  }
} 