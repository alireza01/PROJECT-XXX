import { supabase } from './supabase';

// Define VocabularyLevel type
export type VocabularyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

// Get words for a specific page, filtered by the user's level
export async function getPageWords(pageId: string, userLevel: VocabularyLevel) {
  try {
    const { data: words, error: wordsError } = await supabase
      .from('vocabulary')
      .select('*')
      .eq('bookId', pageId)
      .eq('level', userLevel);

    if (wordsError) throw wordsError;
    return words;
  } catch (err) {
    console.error("Error getting page words:", err);
    return [];
  }
}

// Get all levels that should be shown to a user of a specific level
function getLevelsForUser(userLevel: VocabularyLevel): VocabularyLevel[] {
  switch (userLevel) {
    case 'BEGINNER':
      return ['BEGINNER'];
    case 'INTERMEDIATE':
      return ['BEGINNER', 'INTERMEDIATE'];
    case 'ADVANCED':
      return ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
    default:
      return ['BEGINNER'];
  }
}

// Get a specific explanation by ID
export async function getWordExplanation(explanationId: string) {
  try {
    const { data: explanation, error: explanationError } = await supabase
      .from('vocabulary')
      .select('*')
      .eq('id', explanationId)
      .single();

    if (explanationError) throw explanationError;
    return explanation;
  } catch (err) {
    console.error("Error getting word explanation:", err);
    return null;
  }
}

// Add a new word with explanation
export async function addWord(
  word: string,
  persianMeaning: string,
  difficultyLevel: VocabularyLevel,
  explanation?: string, 
  example?: string,
  pronunciation?: string
) {
  try {
    // Check if word already exists
    const { data: wordRecord, error: wordError } = await supabase
      .from('vocabulary')
      .select('*')
      .eq('word', word)
      .single();

    if (wordError) throw wordError;
    
    // If word doesn't exist, create it
    if (!wordRecord) {
      const { data: newWord, error: createError } = await supabase
        .from('vocabulary')
        .insert([{
          word,
          pronunciation,
        }])
        .select()
        .single();

      if (createError) throw createError;
    }
    
    // Create explanation
    const { data: explanationRecord, error: explanationError } = await supabase
      .from('vocabulary')
      .insert([{
        wordId: wordRecord?.id,
        difficultyLevel,
        persianMeaning,
        explanation,
        example,
      }])
      .select()
      .single();

    if (explanationError) throw explanationError;
    
    return explanationRecord;
  } catch (err) {
    console.error("Error adding word:", err);
    throw err;
  }
}

// Tag a word in a book page
export async function tagWordInPage(
  pageId: string,
  wordId: string,
  explanationId: string,
  startOffset: number,
  endOffset: number
) {
  try {
    const { data: position, error } = await supabase
      .from('vocabulary')
      .insert([{
        pageId,
        wordId,
        explanationId,
        startOffset,
        endOffset,
      }])
      .select()
      .single();

    if (error) throw error;
    
    return position;
  } catch (error) {
    console.error("Error tagging word in page:", error);
    throw error;
  }
}

export async function getVocabularyByBook(bookId: string) {
  const { data: words, error } = await supabase
    .from('vocabulary')
    .select('*')
    .eq('bookId', bookId);

  if (error) throw error;
  return words;
}

export async function getVocabularyByLevel(level: VocabularyLevel) {
  const { data: words, error } = await supabase
    .from('vocabulary')
    .select('*')
    .eq('level', level);

  if (error) throw error;
  return words;
}

export async function createVocabulary(word: {
  word: string;
  meaning: string;
  explanation: string;
  level: VocabularyLevel;
  bookId: string;
  createdById: string;
}) {
  const { data, error } = await supabase
    .from('vocabulary')
    .insert([word])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateVocabulary(id: string, updates: Partial<{
  word: string;
  meaning: string;
  explanation: string;
  level: VocabularyLevel;
}>) {
  const { data, error } = await supabase
    .from('vocabulary')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteVocabulary(id: string) {
  const { error } = await supabase
    .from('vocabulary')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
