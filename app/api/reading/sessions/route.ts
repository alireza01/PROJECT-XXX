import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ReadingSession } from '@/types';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { bookId, startTime, endTime } = await request.json();
    const duration = Math.floor((new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000);

    const { data, error } = await supabase
      .from('reading_sessions')
      .insert({
        user_id: session.user.id,
        book_id: bookId,
        start_time: startTime,
        end_time: endTime,
        duration,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating reading session:', error);
    return NextResponse.json(
      { error: 'Failed to create reading session' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get('bookId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let query = supabase
      .from('reading_sessions')
      .select('*')
      .eq('user_id', session.user.id);

    if (bookId) {
      query = query.eq('book_id', bookId);
    }

    if (startDate) {
      query = query.gte('start_time', startDate);
    }

    if (endDate) {
      query = query.lte('end_time', endDate);
    }

    const { data, error } = await query.order('start_time', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching reading sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reading sessions' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { sessionId, endPage, startPage } = await request.json();

    // TODO: Add database integration
    const session: ReadingSession = {
      id: sessionId,
      userId: 'user-123', // TODO: Get from session
      bookId: 'book-123', // TODO: Get from session
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      pagesRead: endPage - startPage,
      duration: 3600, // TODO: Calculate actual duration
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(session);
  } catch (error) {
    console.error('Error ending reading session:', error);
    return NextResponse.json(
      { error: 'Failed to end reading session' },
      { status: 500 }
    );
  }
} 