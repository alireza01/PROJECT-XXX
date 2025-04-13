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

    const prompts = await prisma.translationPrompt.findMany({
      orderBy: {
        isDefault: 'desc'
      }
    });

    return NextResponse.json(prompts);
  } catch (error) {
    console.error('Error fetching translation prompts:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { name, prompt, isDefault } = body;

    if (!name || !prompt) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // If this is set as default, unset any existing default
    if (isDefault) {
      await prisma.translationPrompt.updateMany({
        where: {
          isDefault: true
        },
        data: {
          isDefault: false
        }
      });
    }

    const translationPrompt = await prisma.translationPrompt.create({
      data: {
        name,
        prompt,
        isDefault
      }
    });

    return NextResponse.json(translationPrompt);
  } catch (error) {
    console.error('Error creating translation prompt:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const body = await req.json();
    const { name, prompt, isDefault } = body;

    if (!id) {
      return new NextResponse('Missing prompt ID', { status: 400 });
    }

    // If this is set as default, unset any existing default
    if (isDefault) {
      await prisma.translationPrompt.updateMany({
        where: {
          isDefault: true,
          id: { not: id }
        },
        data: {
          isDefault: false
        }
      });
    }

    const translationPrompt = await prisma.translationPrompt.update({
      where: { id },
      data: {
        name,
        prompt,
        isDefault
      }
    });

    return NextResponse.json(translationPrompt);
  } catch (error) {
    console.error('Error updating translation prompt:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return new NextResponse('Missing prompt ID', { status: 400 });
    }

    await prisma.translationPrompt.delete({
      where: { id }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting translation prompt:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 