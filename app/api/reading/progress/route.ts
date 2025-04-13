import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { bookId, currentPage, totalPages, lastReadAt } = await request.json();

    const { data, error } = await supabase
      .from('reading_progress')
      .upsert({
        user_id: session.user.id,
        book_id: bookId,
        current_page: currentPage,
        total_pages: totalPages,
        last_read_at: lastReadAt,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return Response.json(data);
  } catch (error) {
    console.error('Error updating reading progress:', error);
    return Response.json(
      { error: 'Failed to update reading progress' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get('bookId');

    let query = supabase
      .from('reading_progress')
      .select('*')
      .eq('user_id', session.user.id);

    if (bookId) {
      query = query.eq('book_id', bookId);
    }

    const { data, error } = await query.order('last_read_at', { ascending: false });

    if (error) throw error;

    return Response.json(data);
  } catch (error) {
    console.error('Error fetching reading progress:', error);
    return Response.json(
      { error: 'Failed to fetch reading progress' },
      { status: 500 }
    );
  }
} 