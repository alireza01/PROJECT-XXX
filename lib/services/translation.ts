import { GoogleGenerativeAI } from '@google/generative-ai';
import { ApiKeyManager } from './api-key-manager';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { logError, logInfo } from '@/lib/logger';

export interface TranslationContext {
  text: string;
  bookId: string;
  context: string;
  bookTitle?: string;
  authorName?: string;
}

export interface TranslationResult {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
  provider: string;
  timestamp: number;
  userId?: string;
  bookId?: string;
}

export class TranslationService {
  private static instance: TranslationService;
  private genAI!: GoogleGenerativeAI;
  private cache: Map<string, TranslationResult> = new Map();
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  private apiKeyManager: ApiKeyManager;
  private readonly MAX_RETRIES = 3;

  private constructor() {
    // @ts-ignore - We know this is safe because ApiKeyManager is a singleton
    this.apiKeyManager = ApiKeyManager.getInstance();
  }

  public static getInstance(): TranslationService {
    if (!TranslationService.instance) {
      TranslationService.instance = new TranslationService();
    }
    return TranslationService.instance;
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  private async saveTranslationToDatabase(result: TranslationResult): Promise<void> {
    try {
      const { error } = await supabase
        .from('translations')
        .insert({
          original_text: result.text,
          translated_text: result.text,
          source_language: result.sourceLanguage,
          target_language: result.targetLanguage,
          provider: result.provider,
          user_id: result.userId,
          book_id: result.bookId,
          created_at: new Date().toISOString()
        });

      if (error) {
        logError(new Error('Failed to save translation to database'), { error });
      }
    } catch (error) {
      logError(error as Error, { context: 'saveTranslationToDatabase' });
    }
  }

  async translate(
    text: string,
    targetLanguage: string,
    sourceLanguage: string = 'auto',
    context?: TranslationContext
  ): Promise<TranslationResult> {
    if (!text) {
      throw new Error('Text to translate cannot be empty');
    }

    if (!targetLanguage) {
      throw new Error('Target language is required');
    }

    const cacheKey = `${text}-${sourceLanguage}-${targetLanguage}`;
    const cachedResult = this.cache.get(cacheKey);

    if (cachedResult && this.isCacheValid(cachedResult.timestamp)) {
      return cachedResult;
    }

    let lastError: Error | null = null;
    let lastUsedKey: string | null = null;

    // Get the current user's ID
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || null;

    // Try up to MAX_RETRIES times with different API keys
    for (let attempt = 0; attempt < this.MAX_RETRIES; attempt++) {
      try {
        // Get a random API key, excluding the last failed key
        const apiKey = await this.apiKeyManager.getRandomApiKey(userId, lastUsedKey || undefined);
        lastUsedKey = apiKey;
        this.genAI = new GoogleGenerativeAI(apiKey);

        const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
        
        // Enhanced prompt with context if available
        let prompt = `Translate the following text from ${sourceLanguage} to ${targetLanguage}. Only return the translated text, nothing else:\n\n${text}`;
        
        if (context) {
          prompt = `Context: ${context.context}\n\n${prompt}`;
        }

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const translatedText = response.text();

        if (!translatedText) {
          throw new Error('Translation returned empty result');
        }

        const translationResult: TranslationResult = {
          text: translatedText,
          sourceLanguage,
          targetLanguage,
          provider: 'gemini',
          timestamp: Date.now(),
          userId,
          bookId: context?.bookId
        };

        // Save to cache
        this.cache.set(cacheKey, translationResult);

        // Save to database in background
        this.saveTranslationToDatabase(translationResult).catch(error => {
          logError(error as Error, { context: 'background save to database' });
        });

        return translationResult;
      } catch (error) {
        lastError = error as Error;
        logError(lastError, { attempt: attempt + 1 });
        
        // Log the API error and mark the key as failed
        if (lastUsedKey) {
          await this.apiKeyManager.logApiError(
            lastUsedKey,
            lastError.message,
            lastError instanceof Response ? lastError.status : undefined
          );
        }

        // If this was the last attempt, throw a generic error
        if (attempt === this.MAX_RETRIES - 1) {
          throw new Error('Translation service is temporarily unavailable. Please try again later.');
        }
      }
    }

    throw lastError || new Error('Translation failed');
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }
}

export function extractContext(fullText: string, selectedText: string): { before: string; after: string } {
  const maxContextLength = 100; // Characters to include before and after
  const textIndex = fullText.indexOf(selectedText);
  
  if (textIndex === -1) {
    return { before: '', after: '' };
  }

  const beforeStart = Math.max(0, textIndex - maxContextLength);
  const afterEnd = Math.min(fullText.length, textIndex + selectedText.length + maxContextLength);

  return {
    before: fullText.slice(beforeStart, textIndex).trim(),
    after: fullText.slice(textIndex + selectedText.length, afterEnd).trim(),
  };
}

export function getSurroundingText(
  text: string,
  selectedText: string,
  contextLines: number = 3
): string {
  const lines = text.split('\n');
  const selectedLineIndex = lines.findIndex(line => line.includes(selectedText));

  if (selectedLineIndex === -1) {
    return '';
  }

  const start = Math.max(0, selectedLineIndex - contextLines);
  const end = Math.min(lines.length, selectedLineIndex + contextLines + 1);

  return lines.slice(start, end).join('\n');
}

// Helper function for simple translations
export async function translateText(
  text: string,
  targetLanguage: string,
  sourceLanguage: string = 'auto'
): Promise<string> {
  const service = TranslationService.getInstance();
  const result = await service.translate(text, targetLanguage, sourceLanguage);
  return result.text;
} 