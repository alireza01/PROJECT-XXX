import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { GoogleGenerativeAI } from '@google/generative-ai'
import { supabase } from '@/lib/supabase'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY || '')

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: apiKeys, error } = await supabase
      .from('gemini_api_keys')
      .select('*')
      .or(`user_id.eq.${session.user.id},is_public.eq.true`);

    if (error) {
      console.error('Error fetching API keys:', error);
      return Response.json({ error: 'Failed to fetch API keys' }, { status: 500 });
    }

    return Response.json({ apiKeys });
  } catch (error) {
    console.error('Error in GET /api/gemini:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { apiKey, isPublic } = await request.json();

    const { data, error } = await supabase
      .from('gemini_api_keys')
      .insert([
        {
          user_id: session.user.id,
          api_key: apiKey,
          is_public: isPublic || false,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating API key:', error);
      return Response.json({ error: 'Failed to create API key' }, { status: 500 });
    }

    return Response.json({ apiKey: data });
  } catch (error) {
    console.error('Error in POST /api/gemini:', error);
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
      .from('gemini_api_keys')
      .delete()
      .match({ id, user_id: session.user.id });

    if (error) {
      console.error('Error deleting API key:', error);
      return Response.json({ error: 'Failed to delete API key' }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/gemini:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
} 