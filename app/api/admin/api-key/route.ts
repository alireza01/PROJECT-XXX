import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const apiKey = await prisma.apiKey.findFirst({
      where: { isActive: true },
    });

    return new Response(JSON.stringify({ apiKey: apiKey?.key || null }));
  } catch (error) {
    console.error('Error fetching API key:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { apiKey } = await request.json();

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key is required' }), { status: 400 });
    }

    // Deactivate all existing API keys
    await prisma.apiKey.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    // Create new API key
    await prisma.apiKey.create({
      data: {
        key: apiKey,
        isActive: true,
        userId: session.user.id,
      },
    });

    return new Response(JSON.stringify({ success: true }));
  } catch (error) {
    console.error('Error saving API key:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
} 