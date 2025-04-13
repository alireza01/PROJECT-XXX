import { useEffect, useState } from 'react';
import { ReadingProgress, ReadingSession } from '@/types';
import { formatDuration, formatLastReadTime } from '@/utils/reading';

interface ReadingStatsProps {
  bookId: string;
}

export default function ReadingStats({ bookId }: ReadingStatsProps) {
  const [progress, setProgress] = useState<ReadingProgress | null>(null);
  const [sessions, setSessions] = useState<ReadingSession[]>([]);

  useEffect(() => {
    // TODO: Fetch reading progress and sessions from API
    const mockProgress: ReadingProgress = {
      id: 'progress-123',
      userId: 'user-123',
      bookId,
      currentPage: 150,
      totalPages: 300,
      lastReadAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const mockSessions: ReadingSession[] = [
      {
        id: 'session-1',
        userId: 'user-123',
        bookId,
        startTime: new Date(Date.now() - 3600000).toISOString(),
        endTime: new Date().toISOString(),
        pagesRead: 30,
        duration: 3600,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    setProgress(mockProgress);
    setSessions(mockSessions);
  }, [bookId]);

  if (!progress) return null;

  const progressPercentage = (progress.currentPage / progress.totalPages) * 100;
  const totalPagesRead = sessions.reduce((sum, session) => sum + session.pagesRead, 0);
  const totalReadingTime = sessions.reduce((sum, session) => sum + session.duration, 0);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">Reading Progress</h3>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-sm text-gray-600">
          {progress.currentPage} of {progress.totalPages} pages ({progressPercentage.toFixed(1)}%)
        </p>
        <p className="text-sm text-gray-500">
          Last read {formatLastReadTime(progress.lastReadAt)}
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">Reading Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Pages Read</p>
            <p className="text-2xl font-bold text-gray-900">{totalPagesRead}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Reading Time</p>
            <p className="text-2xl font-bold text-gray-900">{formatDuration(totalReadingTime)}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">Recent Sessions</h3>
        <div className="space-y-2">
          {sessions.map((session) => (
            <div key={session.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  {new Date(session.startTime).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">{session.pagesRead} pages</p>
              </div>
              <p className="text-sm text-gray-500">
                Duration: {formatDuration(session.duration)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 