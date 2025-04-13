import { createClient } from '@supabase/supabase-js';
import { cache } from 'react';

// Translation service configuration
interface TranslationConfig {
  provider: 'google' | 'deepl' | 'azure' | 'libre';
  apiKey: string;
  defaultSourceLanguage: string;
  defaultTargetLanguage: string;
}

// Translation result type
interface TranslationResult {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
  provider: string;
}

class TranslationService {
  private config: TranslationConfig;
  private supabase;

  constructor(config: TranslationConfig) {
    this.config = config;
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  // Cache translations to reduce API calls
  private async getCachedTranslation(
    text: string,
    targetLanguage: string
  ): Promise<TranslationResult | null> {
    const { data } = await this.supabase
      .from('translations')
      .select('*')
      .eq('original_text', text)
      .eq('target_language', targetLanguage)
      .single();

    return data;
  }

  private async cacheTranslation(result: TranslationResult) {
    await this.supabase.from('translations').insert({
      original_text: result.text,
      translated_text: result.text,
      source_language: result.sourceLanguage,
      target_language: result.targetLanguage,
      provider: result.provider,
    });
  }

  // Main translation method
  async translate(
    text: string,
    targetLanguage: string = this.config.defaultTargetLanguage,
    sourceLanguage: string = this.config.defaultSourceLanguage
  ): Promise<TranslationResult> {
    // Check cache first
    const cached = await this.getCachedTranslation(text, targetLanguage);
    if (cached) {
      return cached;
    }

    let result: TranslationResult;

    switch (this.config.provider) {
      case 'google':
        result = await this.translateWithGoogle(text, targetLanguage, sourceLanguage);
        break;
      case 'deepl':
        result = await this.translateWithDeepL(text, targetLanguage, sourceLanguage);
        break;
      case 'azure':
        result = await this.translateWithAzure(text, targetLanguage, sourceLanguage);
        break;
      case 'libre':
        result = await this.translateWithLibre(text, targetLanguage, sourceLanguage);
        break;
      default:
        throw new Error('Unsupported translation provider');
    }

    // Cache the result
    await this.cacheTranslation(result);
    return result;
  }

  // Individual provider implementations
  private async translateWithGoogle(
    text: string,
    targetLanguage: string,
    sourceLanguage: string
  ): Promise<TranslationResult> {
    // Implementation for Google Cloud Translation
    // You'll need to add the actual API call here
    return {
      text: 'Translated text from Google',
      sourceLanguage,
      targetLanguage,
      provider: 'google',
    };
  }

  private async translateWithDeepL(
    text: string,
    targetLanguage: string,
    sourceLanguage: string
  ): Promise<TranslationResult> {
    // Implementation for DeepL
    return {
      text: 'Translated text from DeepL',
      sourceLanguage,
      targetLanguage,
      provider: 'deepl',
    };
  }

  private async translateWithAzure(
    text: string,
    targetLanguage: string,
    sourceLanguage: string
  ): Promise<TranslationResult> {
    // Implementation for Azure Translator
    return {
      text: 'Translated text from Azure',
      sourceLanguage,
      targetLanguage,
      provider: 'azure',
    };
  }

  private async translateWithLibre(
    text: string,
    targetLanguage: string,
    sourceLanguage: string
  ): Promise<TranslationResult> {
    // Implementation for LibreTranslate
    return {
      text: 'Translated text from Libre',
      sourceLanguage,
      targetLanguage,
      provider: 'libre',
    };
  }
}

// Create a singleton instance
const translationService = new TranslationService({
  provider: 'google', // Default provider
  apiKey: process.env.TRANSLATION_API_KEY || '',
  defaultSourceLanguage: 'en',
  defaultTargetLanguage: 'fa', // Persian as default target
});

// Export cached version for React components
export const getTranslation = cache(async (
  text: string,
  targetLanguage?: string,
  sourceLanguage?: string
) => {
  return translationService.translate(text, targetLanguage, sourceLanguage);
});

export default translationService; 