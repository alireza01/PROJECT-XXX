import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Define ReadingSession type
interface ReadingSession {
  id: string;
  user_id: string;
  book_id: string;
  start_time: string;
  end_time: string;
  duration: number;
  created_at: string;
  updated_at: string;
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
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

    return new NextResponse(JSON.stringify(data));
  } catch (error) {
    console.error('Error creating reading session:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to create reading session' }),
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
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

    return new NextResponse(JSON.stringify(data));
  } catch (error) {
    console.error('Error fetching reading sessions:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch reading sessions' }),
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { sessionId, endPage, startPage } = await request.json();

    // Get the existing session
    const { data: existingSession, error: fetchError } = await supabase
      .from('reading_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (fetchError) throw fetchError;

    if (!existingSession) {
      return new NextResponse(JSON.stringify({ error: 'Session not found' }), { status: 404 });
    }

    // Update the session
    const { data: updatedSession, error: updateError } = await supabase
      .from('reading_sessions')
      .update({
        end_time: new Date().toISOString(),
        pages_read: endPage - startPage,
        duration: Math.floor((new Date().getTime() - new Date(existingSession.start_time).getTime()) / 1000),
      })
      .eq('id', sessionId)
      .select()
      .single();

    if (updateError) throw updateError;

    return new NextResponse(JSON.stringify(updatedSession));
  } catch (error) {
    console.error('Error ending reading session:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to end reading session' }),
      { status: 500 }
    );
  }
} 