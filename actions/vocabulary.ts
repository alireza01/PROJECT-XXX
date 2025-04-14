// File: @actions/vocabulary.ts
"use server";

import { supabase } from '@/lib/supabase/client';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import type { Database } from '@/types/supabase';

// Define Level type locally
type Level = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

// --- Authentication Helper (Consider moving to a shared file later) ---
async function getAuthenticatedUserId(): Promise<string> {
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
 */
export async function getPageWordsAction(pageId: string) {
  try {
    const userId = await getAuthenticatedUserId();

    // TODO: Need a way to map pageId to bookId
    const bookId = pageId; // Placeholder: Assuming pageId can be used as bookId or mapped
    console.warn("getPageWordsAction: Assuming pageId maps to bookId. Review this logic.");

    const { data, error } = await supabase
      .from('vocabulary')
      .select('*')
      .eq('book_id', bookId);

    if (error) throw error;
    
    return { success: true, data: data || [] };
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
    const { data, error } = await supabase
      .from('vocabulary')
      .select('*')
      .eq('id', explanationId)
      .single();

    if (error) throw error;

    if (!data) {
        return { success: false, error: "Explanation not found", data: null };
    }

    return { success: true, data };
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
  bookId: string,
  word: string,
  persianMeaning: string,
  difficultyLevel: Level,
  explanationText?: string,
  example?: string,
  pronunciation?: string
) {
  try {
    const userId = await getAuthenticatedUserId();

    const { data, error } = await supabase
      .from('vocabulary')
      .insert({
        word: word,
        meaning: persianMeaning,
        level: difficultyLevel,
        explanation: explanationText || '',
        book_id: bookId,
        created_by: userId,
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/admin-secure-dashboard-xyz123/words');

    return {
      success: true,
      data: {
        vocabulary: data
      }
    };
  } catch (error: any) {
    console.error("Error adding word:", error);
    if (error.code === '23505') {
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

    // The BookWordPosition model does not exist in the current schema.
    // This functionality needs schema modification to be implemented.
    console.error("Error tagging word: Feature not supported by current database schema (missing BookWordPosition model).");
    return { success: false, error: "Feature not supported by current database schema." };

    revalidatePath('/library');
    console.log(`Word tagged on page ${pageId}. Consider specific revalidation for the book reading page.`);
  } catch (error: any) {
    console.error("Error tagging word in page:", error);
    if (error.message === "User not authenticated") {
        return { success: false, error: "Authentication required." };
    }
    if (error.code === '23505') {
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
    // The Vocabulary model does not have a 'searchCount' field in the schema.
    console.warn(`Attempted to increment search count for word ${wordId}, but 'searchCount' field does not exist on Vocabulary model.`);
  } catch (error) {
    // Log error but don't necessarily throw, as this might be non-critical
    console.error(`Failed to increment search count for word ${wordId}:`, error);
  }
}
