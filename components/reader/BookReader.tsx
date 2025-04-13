import { TextSelectionHandler } from './TextSelectionHandler';

interface BookReaderProps {
  bookId: string;
  content: string;
}

export function BookReader({ bookId, content }: BookReaderProps) {
  return (
    <TextSelectionHandler bookId={bookId}>
      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </TextSelectionHandler>
  );
} 