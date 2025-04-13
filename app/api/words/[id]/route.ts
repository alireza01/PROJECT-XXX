// @/app/api/words/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma-client"; // Use correct prisma client
import { incrementWordSearchCount } from "@/actions/vocabulary"; // Corrected path

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const wordId = params.id;

    // Fetch the word details
    const word = await prisma.word.findUnique({
      where: { id: wordId },
      // Select specific fields if not all are needed by the client
      // select: { id: true, word: true, meaning: true, level: true, example: true, pronunciation: true }
    });

    if (!word) {
      return NextResponse.json({ error: "Word not found" }, { status: 404 });
    }

    // Increment search count (fire-and-forget, or await if necessary)
    // Using await ensures it completes before sending response, but might slightly delay it.
    // Not awaiting allows faster response but risks the count not incrementing if the server stops immediately after.
    try {
        await incrementWordSearchCount(wordId);
    } catch (incrementError) {
        // Log the error but don't fail the main request just because count failed
        console.error(`Failed to increment search count for word ${wordId}:`, incrementError);
    }


    // Return the word data
    return NextResponse.json(word);

  } catch (error) {
    console.error("API Error: [/api/words/[id] GET]", error);
    return NextResponse.json(
        { error: "Internal Server Error fetching word" },
        { status: 500 }
    );
  }
}

// TODO: Consider adding PUT/DELETE handlers for admin word management if needed via API
// Or handle these via Server Actions directly in admin components.