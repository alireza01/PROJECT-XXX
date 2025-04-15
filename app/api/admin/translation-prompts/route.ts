import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const prompts = await prisma.translationPrompt.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return new Response(JSON.stringify({ prompts }));
  } catch (error) {
    console.error('Error fetching translation prompts:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { name, prompt, isDefault } = await request.json();

    if (!name || !prompt) {
      return new Response(JSON.stringify({ error: 'Name and prompt are required' }), { status: 400 });
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

    return new Response(JSON.stringify({ prompt: newPrompt }));
  } catch (error) {
    console.error('Error creating translation prompt:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ error: 'Prompt ID is required' }), { status: 400 });
    }

    await prisma.translationPrompt.delete({
      where: { id },
    });

    return new Response(JSON.stringify({ success: true }));
  } catch (error) {
    console.error('Error deleting translation prompt:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
} 