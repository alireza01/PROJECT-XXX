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

    const prompts = await prisma.translationPrompt.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ prompts });
  } catch (error) {
    console.error('Error fetching translation prompts:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { name, prompt, isDefault } = await request.json();

    if (!name || !prompt) {
      return new NextResponse('Name and prompt are required', { status: 400 });
    }

    if (isDefault) {
      // Remove default status from other prompts
      await prisma.translationPrompt.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      });
    }

    const newPrompt = await prisma.translationPrompt.create({
      data: {
        name,
        prompt,
        isDefault,
      },
    });

    return NextResponse.json({ prompt: newPrompt });
  } catch (error) {
    console.error('Error creating translation prompt:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return new NextResponse('Prompt ID is required', { status: 400 });
    }

    await prisma.translationPrompt.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting translation prompt:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 