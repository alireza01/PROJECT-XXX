// @/app/api/books/[id]/like/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma-client";
import { getAuthSession } from "@/lib/auth";

const bookIdSchema = z.object({
  id: z.string().uuid()
});

// GET handler to check like status
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = bookIdSchema.parse(params);
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return Response.json({ isLiked: false });
    }

    const like = await prisma.like.findUnique({
      where: {
        userId_bookId: {
          userId: session.user.id,
          bookId: id
        }
      }
    });

    return Response.json({ isLiked: !!like });
  } catch (error) {
    console.error('Error checking like status:', error);
    return Response.json(
      { error: 'Failed to check like status' },
      { status: 500 }
    );
  }
}

// POST handler to add a like
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = bookIdSchema.parse(params);
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const like = await prisma.like.create({
      data: {
        userId: session.user.id,
        bookId: id
      }
    });

    return Response.json(like);
  } catch (error) {
    console.error('Error liking book:', error);
    return Response.json(
      { error: 'Failed to like book' },
      { status: 500 }
    );
  }
}

// DELETE handler to remove a like
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = bookIdSchema.parse(params);
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await prisma.like.delete({
      where: {
        userId_bookId: {
          userId: session.user.id,
          bookId: id
        }
      }
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error unliking book:', error);
    return Response.json(
      { error: 'Failed to unlike book' },
      { status: 500 }
    );
  }
}