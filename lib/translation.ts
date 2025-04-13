import { GoogleGenerativeAI } from '@google/generative-ai';
import { TranslationResult } from '@/types/translation';

export class TranslationService {
  private genAI: GoogleGenerativeAI;
  private cache: Map<string, TranslationResult> = new Map();
  private readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('API key is required for TranslationService');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_TTL;
  }

  async translate(
    text: string,
    targetLanguage: string,
    sourceLanguage: string = 'auto'
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

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      const prompt = `Translate the following text from ${sourceLanguage} to ${targetLanguage}. Only return the translated text, nothing else:\n\n${text}`;
      
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
        timestamp: Date.now()
      };

      this.cache.set(cacheKey, translationResult);
      return translationResult;
    } catch (error) {
      console.error('Translation error:', error);
      throw new Error(`Failed to translate text: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }
} 