import { NextResponse } from 'next/server';
import type { NextResponse as NextResponseType } from 'next/server';
import { translateText } from '@/lib/services/translation';
import { getBookContent } from '@/lib/services/books';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { bookId, selectedText, targetLanguage = 'English' } = await request.json();

    if (!bookId || !selectedText) {
      return NextResponse.json(
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
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    // Translate the text with context
    const translation = await translateText({
      text: selectedText,
      bookId,
      context: book.content,
      bookTitle: book.title,
      authorName: book.author,
    });

    return NextResponse.json(translation);
  } catch (error) {
    console.error('Translation API error:', error);
    return NextResponse.json(
      { error: 'Failed to translate text' },
      { status: 500 }
    );
  }
} 