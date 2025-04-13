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

    const errors = await prisma.apiErrorLog.findMany({
      where: {
        apiKey: {
          OR: [
            { userId: session.user.id },
            { userId: null }
          ]
        }
      },
      include: {
        apiKey: true
      },
      orderBy: {
        timestamp: 'desc'
      }
    });

    return NextResponse.json(errors);
  } catch (error) {
    console.error('Error fetching error logs:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { apiKeyId, error, statusCode } = body;

    if (!apiKeyId || !error) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const errorLog = await prisma.apiErrorLog.create({
      data: {
        apiKeyId,
        error,
        statusCode
      }
    });

    return NextResponse.json(errorLog);
  } catch (error) {
    console.error('Error creating error log:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return new NextResponse('Missing error log ID', { status: 400 });
    }

    const errorLog = await prisma.apiErrorLog.update({
      where: {
        id,
        apiKey: {
          OR: [
            { userId: session.user.id },
            { userId: null }
          ]
        }
      },
      data: {
        resolved: true
      }
    });

    return NextResponse.json(errorLog);
  } catch (error) {
    console.error('Error updating error log:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 