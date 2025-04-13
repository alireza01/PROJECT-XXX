import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
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

    return new Response(JSON.stringify(errors), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching error logs:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { apiKeyId, error, statusCode } = body;

    if (!apiKeyId || !error) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const errorLog = await prisma.apiErrorLog.create({
      data: {
        apiKeyId,
        error,
        statusCode
      }
    });

    return new Response(JSON.stringify(errorLog), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating error log:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing error log ID' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
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

    return new Response(JSON.stringify(errorLog), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating error log:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 