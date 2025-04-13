import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TranslationProps {
  text: string;
  targetLanguage?: string;
  sourceLanguage?: string;
  className?: string;
  showLoader?: boolean;
  autoTranslate?: boolean;
  children?: (props: {
    translatedText: string;
    isLoading: boolean;
    error: Error | null;
  }) => React.ReactNode;
}

export function Translation({
  text,
  targetLanguage,
  sourceLanguage,
  className,
  showLoader = true,
  autoTranslate = true,
  children,
}: TranslationProps) {
  const { translatedText, isLoading, error } = useTranslation(text, {
    targetLanguage,
    sourceLanguage,
    autoTranslate,
  });

  if (children) {
    return <>{children({ translatedText, isLoading, error })}</>;
  }

  return (
    <div className={cn('relative', className)}>
      {isLoading && showLoader && (
        <div className="absolute -right-6 top-1/2 -translate-y-1/2">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )}
      <span className={cn(isLoading && 'opacity-50')}>
        {error ? text : translatedText}
      </span>
    </div>
  );
} 