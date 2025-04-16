import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookId = params.id;
    
    // Here you would typically fetch the book content from your database
    // For now, returning a mock response
    const bookContent = {
      id: bookId,
      content: "Book content will be fetched from database",
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(bookContent), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching book content:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch book content' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookId = params.id;
    const body = await request.json();

    // Here you would typically save the book content to your database
    // For now, returning a mock response
    const savedContent = {
      id: bookId,
      content: body.content,
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(savedContent), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error saving book content:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to save book content' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
} 