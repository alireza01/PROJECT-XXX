import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Languages, X, Info, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface TranslationOverlayProps {
  selectedText: string;
  bookId: string;
  onClose: () => void;
  position: { x: number; y: number };
  bookTitle?: string;
  authorName?: string;
}

interface TranslationResult {
  translatedText: string;
  notes: string[];
  timestamp: string;
  originalContext?: {
    before: string;
    selected: string;
    after: string;
  };
}

export function TranslationOverlay({
  selectedText,
  bookId,
  onClose,
  position,
  bookTitle,
  authorName,
}: TranslationOverlayProps) {
  const [translation, setTranslation] = useState<TranslationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Auto-translate if selected text is short (less than 100 characters)
    if (selectedText.length < 100) {
      handleTranslate();
    }
  }, [selectedText]);

  const handleTranslate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId,
          selectedText,
          bookTitle,
          authorName,
        }),
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      setTranslation(data);
      setIsExpanded(true);
    } catch (error) {
      toast.error('Failed to translate text');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4"
      >
        <Card className="w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur border-t-4 border-primary shadow-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Languages className="h-4 w-4 text-primary" />
                <span className="font-medium">AI Translation</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="h-8 w-8"
                >
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </motion.div>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <motion.div
              animate={{ height: isExpanded ? "auto" : "0" }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-4">
                {translation?.originalContext && (
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p className="opacity-70">{translation.originalContext.before}</p>
                    <p className="font-medium text-foreground">{translation.originalContext.selected}</p>
                    <p className="opacity-70">{translation.originalContext.after}</p>
                  </div>
                )}

                {translation ? (
                  <div className="space-y-4">
                    <div className="text-sm">
                      <div className="font-medium mb-2">Translation:</div>
                      <div className="bg-primary/5 p-3 rounded-lg">
                        {translation.translatedText}
                      </div>
                    </div>

                    {translation.notes.length > 0 && (
                      <div className="text-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <Info className="h-4 w-4 text-primary" />
                          <span className="font-medium">Translation Notes:</span>
                        </div>
                        <div className="bg-primary/5 p-3 rounded-lg space-y-2">
                          {translation.notes.map((note, index) => (
                            <p key={index} className="text-sm">
                              {note}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground">
                      Translated at {new Date(translation.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={handleTranslate}
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Translating...
                      </>
                    ) : (
                      'Translate with AI'
                    )}
                  </Button>
                )}
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
} 