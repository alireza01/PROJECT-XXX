// File: @actions/vocabulary.ts
"use server";

// Removed: import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma-client'; // Corrected relative path
import { createClient } from '../lib/supabase/server'; // Corrected relative path
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
// Removed: import type { Level } from '@prisma/client';

// Define Level type locally based on expected values from Prisma Schema
type Level = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

// --- Authentication Helper (Consider moving to a shared file later) ---
async function getAuthenticatedUserId(): Promise<string> {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    console.error("Authentication error:", error);
    throw new Error("User not authenticated");
  }
  return user.id;
}

// --- Helper Function ---

// Get all levels that should be shown to a user of a specific level
function getLevelsForUser(userLevel: Level): Level[] {
  switch (userLevel) {
    case 'BEGINNER':
      return ['BEGINNER'];
    case 'INTERMEDIATE':
      return ['BEGINNER', 'INTERMEDIATE'];
    case 'ADVANCED':
      return ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
    default:
      console.warn(`Unknown user level "${userLevel}", defaulting to BEGINNER.`);
      return ['BEGINNER'];
  }
}

// --- Server Actions ---

/**
 * Gets words and their explanations for a specific page,
 * filtered by the authenticated user's proficiency level.
 * Assumes a UserProfile model exists linked to the auth user.
 */
export async function getPageWordsAction(pageId: string) {
  try {
    const userId = await getAuthenticatedUserId();

    // Fetch user profile to get their level securely
    const userProfile = await prisma.userProfile.findUnique({
      where: { userId },
      select: { level: true },
    });

    if (!userProfile) {
      console.error(`User profile not found for userId: ${userId}`);
      return { success: false, error: "User profile not found.", data: [] };
    }

    // Type assertion might be needed if Prisma doesn't infer Level correctly without the import
    const userLevel = userProfile.level as Level;

    const words = await prisma.bookWordPosition.findMany({
      where: {
        pageId,
        explanation: {
          difficultyLevel: {
            in: getLevelsForUser(userLevel),
          },
        },
      },
      include: {
        word: true,
        explanation: true,
      },
    });
    return { success: true, data: words };
  } catch (error: any) {
    console.error("Error getting page words:", error);
    if (error.message === "User not authenticated") {
        return { success: false, error: "Authentication required.", data: [] };
    }
    return { success: false, error: error.message || "Failed to get page words", data: [] };
  }
}

/**
 * Gets a specific word explanation by its ID.
 */
export async function getWordExplanationAction(explanationId: string) {
  try {
    const explanation = await prisma.explanation.findUnique({
      where: {
        id: explanationId,
      },
      include: {
        word: true,
      },
    });

    if (!explanation) {
        return { success: false, error: "Explanation not found", data: null };
    }

    return { success: true, data: explanation };
  } catch (error: any) {
    console.error("Error getting word explanation:", error);
    return { success: false, error: error.message || "Failed to get word explanation", data: null };
  }
}

/**
 * Adds a new word and its primary explanation to the database.
 * Requires authenticated user. Implement role checks if needed (e.g., admin).
 */
export async function addWordAction(
  word: string,
  persianMeaning: string,
  difficultyLevel: Level, // Uses the locally defined Level type
  explanationText?: string,
  example?: string,
  pronunciation?: string
) {
  try {
    await getAuthenticatedUserId();

    const wordRecord = await prisma.word.upsert({
        where: { word },
        update: { pronunciation },
        create: { word, pronunciation },
    });

    const explanationRecord = await prisma.explanation.create({
      data: {
        wordId: wordRecord.id,
        difficultyLevel,
        persianMeaning,
        explanation: explanationText,
        example,
      },
    });

    revalidatePath('/admin-secure-dashboard-xyz123/words');

    return {
      success: true,
      data: {
        word: wordRecord,
        explanation: explanationRecord,
      }
    };
  } catch (error: any) {
    console.error("Error adding word:", error);
     // Check for Prisma known error codes if possible (error might have a 'code' property)
     if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
         // Attempt to get target fields if available in meta
         const target = (error.meta?.target as string[])?.join(', ');
         console.warn(`Unique constraint failed on: ${target || 'unknown fields'}`);
         return { success: false, error: `An explanation for this word at level '${difficultyLevel}' might already exist.` };
     }
     if (error.message === "User not authenticated") {
        return { success: false, error: "Authentication required." };
     }
    return { success: false, error: error.message || "Failed to add word" };
  }
}

/**
 * Tags a specific word explanation at a position within a book page.
 * Requires authenticated user. Implement role checks if needed (e.g., admin).
 */
export async function tagWordInPageAction(
  pageId: string,
  wordId: string,
  explanationId: string,
  startOffset: number,
  endOffset: number
) {
  try {
     await getAuthenticatedUserId();

    const position = await prisma.bookWordPosition.create({
      data: {
        pageId,
        wordId,
        explanationId,
        startOffset,
        endOffset,
      },
    });

    revalidatePath('/library');
    console.log(`Word tagged on page ${pageId}. Consider specific revalidation for the book reading page.`);

    return { success: true, data: position };
  } catch (error: any) {
    console.error("Error tagging word in page:", error);
     if (error.message === "User not authenticated") {
        return { success: false, error: "Authentication required." };
     }
     // Check for Prisma known error codes if possible
     if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
        return { success: false, error: "This exact word position might already be tagged." };
     }
    return { success: false, error: error.message || "Failed to tag word" };
  }
}

/**
 * Increments the search count for a given word.
 * Typically called when a word's details are fetched/viewed.
 */
export async function incrementWordSearchCount(wordId: string): Promise<void> {
  try {
    await prisma.word.update({
      where: { id: wordId },
      data: {
        searchCount: {
          increment: 1,
        },
      },
    });
    // console.log(`Incremented search count for word: ${wordId}`);
  } catch (error) {
    // Log error but don't necessarily throw, as this might be non-critical
    console.error(`Failed to increment search count for word ${wordId}:`, error);
  }
}
