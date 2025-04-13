'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Book, ReadingProgress } from '@/types';
import { 
  getReadingProgress, 
  updateReadingProgress, 
  startReadingSession, 
  updateReadingSession 
} from '@/lib/reading-progress';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, BookOpen, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ReadingProgressProps {
  book: Book;
  userId: string;
}

export function ReadingProgress({ book, userId }: ReadingProgressProps) {
  const router = useRouter();
  const [progress, setProgress] = useState<ReadingProgress | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    loadProgress();
  }, [book.id, userId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isReading) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isReading]);

  const loadProgress = async () => {
    try {
      const data = await getReadingProgress(userId, book.id);
      if (data) {
        setProgress(data);
        setCurrentPage(data.currentPage);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const handleStartReading = async () => {
    try {
      const session = await startReadingSession(userId, book.id);
      setSessionId(session.id);
      setStartTime(new Date());
      setIsReading(true);
      setDuration(0);
    } catch (error) {
      console.error('Error starting reading session:', error);
    }
  };

  const handleStopReading = async () => {
    if (!sessionId || !startTime) return;

    try {
      await updateReadingSession(sessionId, {
        endTime: new Date(),
        pagesRead: currentPage - (progress?.currentPage || 0),
        duration
      });
      setIsReading(false);
      setSessionId(null);
      setStartTime(null);
      setDuration(0);
    } catch (error) {
      console.error('Error stopping reading session:', error);
    }
  };

  const handlePageChange = async (value: number) => {
    setCurrentPage(value);
    try {
      await updateReadingProgress(userId, book.id, value, book.pages);
      await loadProgress();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Reading Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Page {currentPage} of {book.pages}</span>
            <span>{progress?.progress.toFixed(1)}%</span>
          </div>
          <Progress value={progress?.progress || 0} className="h-2" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Current Page</label>
          <div className="flex items-center gap-4">
            <Slider
              value={[currentPage]}
              onValueChange={([value]) => handlePageChange(value)}
              max={book.pages}
              step={1}
              className="flex-1"
            />
            <Input
              type="number"
              value={currentPage}
              onChange={(e) => handlePageChange(Number(e.target.value))}
              min={0}
              max={book.pages}
              className="w-20"
            />
          </div>
        </div>

        {isReading ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Reading for {formatDuration(duration)}</span>
            </div>
            <Button 
              variant="destructive" 
              onClick={handleStopReading}
              className="w-full"
            >
              Stop Reading
            </Button>
          </div>
        ) : (
          <Button 
            onClick={handleStartReading}
            className="w-full"
          >
            Start Reading
          </Button>
        )}

        {progress?.lastReadAt && (
          <div className="text-sm text-muted-foreground">
            Last read {formatDistanceToNow(new Date(progress.lastReadAt))} ago
          </div>
        )}
      </CardContent>
    </Card>
  );
} 