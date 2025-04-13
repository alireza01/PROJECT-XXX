import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const apiKeys = await prisma.geminiApiKey.findMany({
      where: {
        OR: [
          { userId: session.user.id },
          { userId: null }
        ]
      },
      include: {
        errorLogs: {
          where: {
            resolved: false
          },
          orderBy: {
            timestamp: 'desc'
          },
          take: 5
        }
      }
    });

    return NextResponse.json(apiKeys);
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { key, name, isDefault } = body;

    if (!key || !name) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // If this is set as default, unset any existing default
    if (isDefault) {
      await prisma.geminiApiKey.updateMany({
        where: {
          isDefault: true,
          userId: session.user.id
        },
        data: {
          isDefault: false
        }
      });
    }

    const apiKey = await prisma.geminiApiKey.create({
      data: {
        key,
        name,
        isDefault,
        userId: session.user.id
      }
    });

    return NextResponse.json(apiKey);
  } catch (error) {
    console.error('Error creating API key:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return new NextResponse('Missing API key ID', { status: 400 });
    }

    await prisma.geminiApiKey.delete({
      where: {
        id,
        userId: session.user.id
      }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting API key:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 