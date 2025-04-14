import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: prompts, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching prompts:', error);
      return Response.json({ error: 'Failed to fetch prompts' }, { status: 500 });
    }

    return Response.json({ prompts });
  } catch (error) {
    console.error('Error in GET /api/gemini/prompts:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content, isPublic } = await request.json();

    const { data, error } = await supabase
      .from('prompts')
      .insert([
        {
          user_id: session.user.id,
          title,
          content,
          is_public: isPublic || false,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating prompt:', error);
      return Response.json({ error: 'Failed to create prompt' }, { status: 500 });
    }

    return Response.json({ prompt: data });
  } catch (error) {
    console.error('Error in POST /api/gemini/prompts:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await request.json();

    const { error } = await supabase
      .from('prompts')
      .delete()
      .match({ id, user_id: session.user.id });

    if (error) {
      console.error('Error deleting prompt:', error);
      return Response.json({ error: 'Failed to delete prompt' }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/gemini/prompts:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
} 