// @/app/api/books/[id]/bookmark/route.ts
import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema for bookmark operations
const bookmarkParamsSchema = z.object({
  id: z.string().uuid({ message: "Invalid book ID format" }),
});

// GET handler to check bookmark status
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Validate the book ID
    const validationResult = bookmarkParamsSchema.safeParse(params);
    if (!validationResult.success) {
      return Response.json(
        { error: "Invalid book ID format" },
        { status: 400 }
      );
    }

    const session = await getAuthSession();

    // If user is not logged in, they haven't bookmarked it
    if (!session?.user) {
      return Response.json({ isBookmarked: false });
    }

    const bookId = params.id;
    const userId = session.user.id;

    // Check if the bookmark exists
    const bookmark = await prisma.bookmark.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
      select: { id: true } // Only need to know if it exists
    });

    return Response.json({ isBookmarked: !!bookmark });

  } catch (error) {
    console.error("API Error: [/api/books/[id]/bookmark GET]", error);
    return Response.json(
      { error: "Failed to check bookmark status" },
      { status: 500 }
    );
  }
}

// POST handler to add a bookmark
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Validate the book ID
    const validationResult = bookmarkParamsSchema.safeParse(params);
    if (!validationResult.success) {
      return Response.json(
        { error: "Invalid book ID format" },
        { status: 400 }
      );
    }

    const session = await getAuthSession();

    if (!session?.user) {
      return Response.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const bookId = params.id;
    const userId = session.user.id;

    // Check if book exists first
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      select: { id: true }
    });

    if (!book) {
      return Response.json(
        { error: "Book not found" },
        { status: 404 }
      );
    }

    // Create bookmark (upsert to handle race conditions)
    await prisma.bookmark.upsert({
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

    return Response.json({ success: true, isBookmarked: true });

  } catch (error) {
    console.error("API Error: [/api/books/[id]/bookmark POST]", error);
    return Response.json(
      { error: "Failed to create bookmark" },
      { status: 500 }
    );
  }
}

// DELETE handler to remove a bookmark
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Validate the book ID
    const validationResult = bookmarkParamsSchema.safeParse(params);
    if (!validationResult.success) {
      return Response.json(
        { error: "Invalid book ID format" },
        { status: 400 }
      );
    }

    const session = await getAuthSession();

    if (!session?.user) {
      return Response.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const bookId = params.id;
    const userId = session.user.id;

    // Delete the bookmark if it exists
    await prisma.bookmark.deleteMany({
      where: {
        userId,
        bookId,
      },
    });

    return Response.json({ success: true, isBookmarked: false });

  } catch (error) {
    console.error("API Error: [/api/books/[id]/bookmark DELETE]", error);
    return Response.json(
      { error: "Failed to remove bookmark" },
      { status: 500 }
    );
  }
}