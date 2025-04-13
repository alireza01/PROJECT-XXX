// @/app/api/books/[id]/like/route.ts
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma-client";
import { z } from "zod";
import type { NextRequest } from 'next/server';

// Validation schema for route parameters
const routeParamsSchema = z.object({
  id: z.string().uuid({ message: "Invalid book ID format" }),
});

/**
 * GET handler to check if the current user has liked a specific book
 * 
 * @param request - Standard Request object
 * @param params - Route parameters containing book id
 * @returns JSON response with isLiked status
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate the book ID
    const result = routeParamsSchema.safeParse(params);
    if (!result.success) {
      return Response.json(
        { error: "Invalid book ID format" },
        { status: 400 }
      );
    }

    const bookId = params.id;
    const session = await getAuthSession();

    // If user is not logged in, return not liked
    if (!session?.user) {
      return Response.json({ isLiked: false });
    }

    const userId = session.user.id;

    // Check if the like exists for this user and book
    const like = await prisma.like.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    });

    return Response.json({ isLiked: !!like });
  } catch (error) {
    console.error("Error checking like status:", error);
    return Response.json(
      { error: "Failed to check like status" },
      { status: 500 }
    );
  }
}

/**
 * POST handler to like a book
 * 
 * @param request - Standard Request object
 * @param params - Route parameters containing book id
 * @returns JSON response with success status
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate the book ID
    const result = routeParamsSchema.safeParse(params);
    if (!result.success) {
      return Response.json(
        { error: "Invalid book ID format" },
        { status: 400 }
      );
    }

    const bookId = params.id;
    const session = await getAuthSession();

    if (!session?.user) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Check if like already exists
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    });

    if (existingLike) {
      return Response.json(
        { error: "Book already liked" },
        { status: 400 }
      );
    }

    // Create new like
    await prisma.like.create({
      data: {
        userId,
        bookId,
      },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error liking book:", error);
    return Response.json(
      { error: "Failed to like book" },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler to unlike a book
 * 
 * @param request - Standard Request object
 * @param params - Route parameters containing book id
 * @returns JSON response with success status
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate the book ID
    const result = routeParamsSchema.safeParse(params);
    if (!result.success) {
      return Response.json(
        { error: "Invalid book ID format" },
        { status: 400 }
      );
    }

    const bookId = params.id;
    const session = await getAuthSession();

    if (!session?.user) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Check if like exists
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    });

    if (!existingLike) {
      return Response.json(
        { error: "Book not liked" },
        { status: 400 }
      );
    }

    // Delete the like
    await prisma.like.delete({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error unliking book:", error);
    return Response.json(
      { error: "Failed to unlike book" },
      { status: 500 }
    );
  }
}