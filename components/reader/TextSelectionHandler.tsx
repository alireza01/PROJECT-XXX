import { useState, useEffect, useRef } from 'react';
import { TranslationOverlay } from './TranslationOverlay';

interface TextSelectionHandlerProps {
  bookId: string;
  children: React.ReactNode;
}

export function TextSelectionHandler({
  bookId,
  children,
}: TextSelectionHandlerProps) {
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        setSelectedText(null);
        setPosition(null);
        return;
      }

      const selectedText = selection.toString().trim();
      if (!selectedText) {
        setSelectedText(null);
        setPosition(null);
        return;
      }

      setSelectedText(selectedText);

      // Get the position of the selection
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect();

      if (containerRect) {
        setPosition({
          x: rect.left - containerRect.left,
          y: rect.bottom - containerRect.top + 10, // Add some padding
        });
      }
    };

    const handleClick = (e: MouseEvent) => {
      // If clicking outside the selection, clear it
      if (!containerRef.current?.contains(e.target as Node)) {
        setSelectedText(null);
        setPosition(null);
      }
    };

    document.addEventListener('selectionchange', handleSelection);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('selectionchange', handleSelection);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {children}
      {selectedText && position && (
        <TranslationOverlay
          selectedText={selectedText}
          bookId={bookId}
          onClose={() => {
            setSelectedText(null);
            setPosition(null);
          }}
          position={position}
        />
      )}
    </div>
  );
} 