import { useState, useEffect } from 'react';
import { getTranslation } from '@/lib/translation';

interface UseTranslationOptions {
  targetLanguage?: string;
  sourceLanguage?: string;
  autoTranslate?: boolean;
}

export function useTranslation(
  text: string,
  options: UseTranslationOptions = {}
) {
  const {
    targetLanguage,
    sourceLanguage,
    autoTranslate = true
  } = options;

  const [translatedText, setTranslatedText] = useState(text);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!autoTranslate) return;

    const translateText = async () => {
      try {
        setIsLoading(true);
        const result = await getTranslation(text, targetLanguage, sourceLanguage);
        setTranslatedText(result.text);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    translateText();
  }, [text, targetLanguage, sourceLanguage, autoTranslate]);

  return {
    translatedText,
    isLoading,
    error,
    translate: async (newText?: string) => {
      const textToTranslate = newText || text;
      try {
        setIsLoading(true);
        const result = await getTranslation(textToTranslate, targetLanguage, sourceLanguage);
        setTranslatedText(result.text);
        setError(null);
        return result.text;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setIsLoading(false);
      }
    }
  };
} 