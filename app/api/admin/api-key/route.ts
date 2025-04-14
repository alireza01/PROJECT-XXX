import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const apiKey = await prisma.apiKey.findFirst({
      where: { isActive: true },
    });

    return NextResponse.json({ apiKey: apiKey?.key || null });
  } catch (error) {
    console.error('Error fetching API key:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { apiKey } = await request.json();

    if (!apiKey) {
      return new NextResponse('API key is required', { status: 400 });
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
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving API key:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 