import { supabase } from '@/lib/supabase/client';
import { trackError } from '@/lib/error-handling';

export type VocabularyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface Vocabulary {
  id: string;
  word: string;
  meaning: string;
  explanation: string;
  level: VocabularyLevel;
  bookId: string;
  createdById: string;
  example?: string;
  pronunciation?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VocabularyTag {
  id: string;
  pageId: string;
  wordId: string;
  explanationId: string;
  startOffset: number;
  endOffset: number;
  createdAt: string;
  updatedAt: string;
}

export class VocabularyService {
  private static instance: VocabularyService;
  private cache: Map<string, Vocabulary[]> = new Map();
  private lastFetch: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  public static getInstance(): VocabularyService {
    if (!VocabularyService.instance) {
      VocabularyService.instance = new VocabularyService();
    }
    return VocabularyService.instance;
  }

  private async fetchVocabulary(pageId: string, userLevel: VocabularyLevel): Promise<Vocabulary[]> {
    const now = Date.now();
    const cacheKey = `${pageId}-${userLevel}`;
    
    if (now - this.lastFetch < this.CACHE_DURATION && this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey) || [];
    }

    try {
      const { data: words, error } = await supabase
        .from('vocabulary')
        .select('*')
        .eq('bookId', pageId)
        .in('level', this.getLevelsForUser(userLevel));

      if (error) throw error;

      const vocabularyList = words || [];
      this.cache.set(cacheKey, vocabularyList);
      this.lastFetch = now;
      return vocabularyList;
    } catch (error) {
      trackError(error as Error, {
        service: 'VocabularyService',
        operation: 'fetchVocabulary',
        pageId,
        userLevel,
      });
      return [];
    }
  }

  private getLevelsForUser(userLevel: VocabularyLevel): VocabularyLevel[] {
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

  public async getPageWords(pageId: string, userLevel: VocabularyLevel): Promise<Vocabulary[]> {
    return this.fetchVocabulary(pageId, userLevel);
  }

  public async getWordExplanation(explanationId: string): Promise<Vocabulary | null> {
    try {
      const { data: explanation, error } = await supabase
        .from('vocabulary')
        .select('*')
        .eq('id', explanationId)
        .single();

      if (error) throw error;
      return explanation;
    } catch (error) {
      trackError(error as Error, {
        service: 'VocabularyService',
        operation: 'getWordExplanation',
        explanationId,
      });
      return null;
    }
  }

  public async addWord(
    word: string,
    persianMeaning: string,
    difficultyLevel: VocabularyLevel,
    bookId: string,
    createdById: string,
    explanation?: string,
    example?: string,
    pronunciation?: string
  ): Promise<Vocabulary | null> {
    try {
      const { data, error } = await supabase
        .from('vocabulary')
        .insert({
          word,
          meaning: persianMeaning,
          level: difficultyLevel,
          explanation,
          example,
          pronunciation,
          bookId,
          createdById,
        })
        .select()
        .single();

      if (error) throw error;
      this.clearCache();
      return data;
    } catch (error) {
      trackError(error as Error, {
        service: 'VocabularyService',
        operation: 'addWord',
        word,
        difficultyLevel,
      });
      return null;
    }
  }

  public async tagWordInPage(
    pageId: string,
    wordId: string,
    explanationId: string,
    startOffset: number,
    endOffset: number
  ): Promise<VocabularyTag | null> {
    try {
      const { data, error } = await supabase
        .from('vocabulary_tags')
        .insert({
          pageId,
          wordId,
          explanationId,
          startOffset,
          endOffset,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      trackError(error as Error, {
        service: 'VocabularyService',
        operation: 'tagWordInPage',
        pageId,
        wordId,
      });
      return null;
    }
  }

  public async getVocabularyByBook(bookId: string): Promise<Vocabulary[]> {
    try {
      const { data, error } = await supabase
        .from('vocabulary')
        .select('*')
        .eq('bookId', bookId);

      if (error) throw error;
      return data;
    } catch (error) {
      trackError(error as Error, {
        service: 'VocabularyService',
        operation: 'getVocabularyByBook',
        bookId,
      });
      return [];
    }
  }

  public async getVocabularyByLevel(level: VocabularyLevel): Promise<Vocabulary[]> {
    try {
      const { data, error } = await supabase
        .from('vocabulary')
        .select('*')
        .eq('level', level);

      if (error) throw error;
      return data;
    } catch (error) {
      trackError(error as Error, {
        service: 'VocabularyService',
        operation: 'getVocabularyByLevel',
        level,
      });
      return [];
    }
  }

  public async updateVocabulary(
    id: string,
    updates: Partial<Omit<Vocabulary, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Vocabulary | null> {
    try {
      const { data, error } = await supabase
        .from('vocabulary')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      this.clearCache();
      return data;
    } catch (error) {
      trackError(error as Error, {
        service: 'VocabularyService',
        operation: 'updateVocabulary',
        id,
      });
      return null;
    }
  }

  public async deleteVocabulary(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('vocabulary')
        .delete()
        .eq('id', id);

      if (error) throw error;
      this.clearCache();
      return true;
    } catch (error) {
      trackError(error as Error, {
        service: 'VocabularyService',
        operation: 'deleteVocabulary',
        id,
      });
      return false;
    }
  }

  private clearCache(): void {
    this.cache.clear();
    this.lastFetch = 0;
  }
} 