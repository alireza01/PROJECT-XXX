import { useEffect, useState } from 'react';
import { getUserReadingProgress } from '@/lib/data';
import { useSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma-client';
import { formatDuration, formatLastReadTime } from '@/utils/reading';

interface ReadingProgress {
  bookId: string;
  progress: number;
  lastReadAt: Date;
}

interface ReadingSession {
  date: Date;
  duration: number;
  pagesRead: number;
}

interface DatabaseReadingSession {
  date: Date;
  duration: number;
  pagesRead: number;
}

export function ReadingStats() {
  const { data: session } = useSession();
  const [progress, setProgress] = useState<ReadingProgress | null>(null);
  const [sessions, setSessions] = useState<ReadingSession[]>([]);

  useEffect(() => {
    async function fetchReadingData() {
      if (!session?.user?.id) return;

      try {
        const readingProgress = await getUserReadingProgress(session.user.id);
        if (readingProgress.length > 0) {
          setProgress(readingProgress[0]);
        }

        // Fetch reading sessions from the database
        const readingSessions = await prisma.readingSession.findMany({
          where: {
            userId: session.user.id,
          },
          orderBy: {
            date: 'desc',
          },
          take: 7, // Last 7 days
        });

        setSessions(readingSessions.map((session: DatabaseReadingSession) => ({
          date: session.date,
          duration: session.duration,
          pagesRead: session.pagesRead,
        })));
      } catch (error) {
        console.error('Error fetching reading data:', error);
      }
    }

    fetchReadingData();
  }, [session?.user?.id]);

  if (!progress) return null;

  const progressPercentage = (progress.progress / 100) * 100;
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
          {progress.progress}%
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
            <div key={session.date.toISOString()} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  {session.date.toLocaleDateString()}
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