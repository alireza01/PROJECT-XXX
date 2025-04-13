import { prisma } from '@/lib/prisma';

export async function getBookContent(bookId: string): Promise<string> {
  try {
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      select: {
        content: true,
        title: true,
      },
    });

    if (!book) {
      throw new Error('Book not found');
    }

    return book.content;
  } catch (error) {
    console.error('Error fetching book content:', error);
    throw new Error('Failed to fetch book content');
  }
} 