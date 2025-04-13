import { GoogleGenerativeAI } from '@google/generative-ai';
import { TranslationResult } from '@/types/translation';

export class TranslationService {
  private genAI: GoogleGenerativeAI;
  private cache: Map<string, TranslationResult> = new Map();

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async translate(
    text: string,
    targetLanguage: string,
    sourceLanguage: string = 'auto'
  ): Promise<TranslationResult> {
    const cacheKey = `${text}-${sourceLanguage}-${targetLanguage}`;
    const cachedResult = this.cache.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      const prompt = `Translate the following text from ${sourceLanguage} to ${targetLanguage}. Only return the translated text, nothing else:\n\n${text}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const translatedText = response.text();

      const translationResult: TranslationResult = {
        text: translatedText,
        sourceLanguage,
        targetLanguage,
        provider: 'gemini'
      };

      this.cache.set(cacheKey, translationResult);
      return translationResult;
    } catch (error) {
      console.error('Translation error:', error);
      throw new Error('Failed to translate text');
    }
  }
} 