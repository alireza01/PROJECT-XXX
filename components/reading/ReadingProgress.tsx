'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Database } from '@/types/supabase';
import { 
  getReadingProgress, 
  updateReadingProgress, 
  startReadingSession, 
  updateReadingSession,
  ReadingProgress as ReadingProgressType
} from '@/lib/reading-progress';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, BookOpen, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

type Book = Database['public']['Tables']['books']['Row'];

interface ReadingProgressProps {
  book: Book;
  userId: string;
}

export function ReadingProgress({ book, userId }: ReadingProgressProps) {
  const router = useRouter();
  const [progress, setProgress] = useState<ReadingProgressType | null>(null);
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
      if (session) {
        setSessionId(session.id);
        setStartTime(new Date());
        setIsReading(true);
        setDuration(0);
      }
    } catch (error) {
      console.error('Error starting reading session:', error);
    }
  };

  const handleStopReading = async () => {
    if (!sessionId || !startTime) return;

    try {
      await updateReadingSession(sessionId, currentPage - (progress?.currentPage || 0), duration);
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
      await updateReadingProgress(userId, book.id, value, book.page_count || 0);
      await loadProgress();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  const progressPercentage = progress ? (progress.currentPage / (book.page_count || 1)) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Reading Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {book.page_count || 0}
            </div>
            <div className="text-sm text-muted-foreground">
              {progress?.lastReadAt && (
                <>Last read {formatDistanceToNow(new Date(progress.lastReadAt))} ago</>
              )}
            </div>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex items-center gap-2">
            <Slider
              value={[currentPage]}
              min={0}
              max={book.page_count || 0}
              step={1}
              onValueChange={([value]) => handlePageChange(value)}
              className="flex-1"
            />
            <Input
              type="number"
              value={currentPage}
              onChange={(e) => handlePageChange(Number(e.target.value))}
              min={0}
              max={book.page_count || 0}
              className="w-20"
            />
          </div>
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handleStartReading}
              disabled={isReading}
            >
              Start Reading
            </Button>
            <Button
              variant="outline"
              onClick={handleStopReading}
              disabled={!isReading}
            >
              Stop Reading
            </Button>
          </div>
          {isReading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Reading time: {formatDuration(duration)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 