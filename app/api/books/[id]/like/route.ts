// @/app/api/books/[id]/like/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

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
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Validate the book ID
    const result = routeParamsSchema.safeParse(params);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid book ID format" },
        { status: 400 }
      );
    }

    const bookId = params.id;
    const session = await auth();

    // If user is not logged in, return not liked
    if (!session?.user) {
      return NextResponse.json({ isLiked: false });
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
      select: { id: true } // Only need to know if it exists
    });

    return NextResponse.json({ isLiked: !!like });
  } catch (error) {
    console.error(`API Error: [/api/books/${params.id}/like GET]`, error);
    return NextResponse.json(
      { error: "Internal server error while checking like status" },
      { status: 500 }
    );
  }
}

/**
 * POST handler to add a like to a book
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Validate the book ID
    const result = routeParamsSchema.safeParse(params);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid book ID format" },
        { status: 400 }
      );
    }

    const bookId = params.id;
    const session = await auth();

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Check if book exists
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      select: { id: true }
    });

    if (!book) {
      return NextResponse.json(
        { error: "Book not found" },
        { status: 404 }
      );
    }

    // Create the like (ignoring if it already exists)
    await prisma.like.upsert({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
      update: {}, // No updates needed if it exists
      create: {
        userId,
        bookId,
      },
    });

    return NextResponse.json({ success: true, isLiked: true });
  } catch (error) {
    console.error(`API Error: [/api/books/${params.id}/like POST]`, error);
    return NextResponse.json(
      { error: "Internal server error while adding like" },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler to remove a like from a book
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Validate the book ID
    const result = routeParamsSchema.safeParse(params);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid book ID format" },
        { status: 400 }
      );
    }

    const bookId = params.id;
    const session = await auth();

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Delete the like if it exists
    await prisma.like.deleteMany({
      where: {
        userId,
        bookId,
      },
    });

    return NextResponse.json({ success: true, isLiked: false });
  } catch (error) {
    console.error(`API Error: [/api/books/${params.id}/like DELETE]`, error);
    return NextResponse.json(
      { error: "Internal server error while removing like" },
      { status: 500 }
    );
  }
}