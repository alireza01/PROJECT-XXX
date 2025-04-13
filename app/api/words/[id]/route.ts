// @/app/api/words/[id]/route.ts
import { prisma } from "@/lib/prisma-client";
import { incrementWordSearchCount } from "@/actions/vocabulary";
import type { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const wordId = params.id;

    // Fetch the word details
    const word = await prisma.word.findUnique({
      where: { id: wordId },
    });

    if (!word) {
      return Response.json({ error: "Word not found" }, { status: 404 });
    }

    // Increment search count
    try {
      await incrementWordSearchCount(wordId);
    } catch (incrementError) {
      console.error(`Failed to increment search count for word ${wordId}:`, incrementError);
    }

    // Return the word data
    return Response.json(word);

  } catch (error) {
    console.error("API Error: [/api/words/[id] GET]", error);
    return Response.json(
      { error: "Internal Server Error fetching word" },
      { status: 500 }
    );
  }
}

// TODO: Consider adding PUT/DELETE handlers for admin word management if needed via API
// Or handle these via Server Actions directly in admin components.