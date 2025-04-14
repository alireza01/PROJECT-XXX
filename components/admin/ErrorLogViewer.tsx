"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface ErrorLog {
  id: string;
  message: string;
  timestamp: string;
  stack?: string;
}

export function ErrorLogViewer() {
  const [logs, setLogs] = useState<ErrorLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/error-logs');
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearLogs = async () => {
    try {
      const response = await fetch('/api/admin/error-logs', {
        method: 'DELETE',
      });
      if (response.ok) {
        setLogs([]);
        toast.success('Logs cleared successfully');
      }
    } catch (error) {
      toast.error('Error clearing logs');
      console.error('Error clearing logs:', error);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Error Logs</CardTitle>
        <Button variant="outline" onClick={handleClearLogs} disabled={isLoading}>
          Clear Logs
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          {logs.length === 0 ? (
            <p className="text-center text-muted-foreground">No error logs found</p>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="rounded-lg border p-4">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{format(new Date(log.timestamp), 'PPpp')}</span>
                  </div>
                  <p className="mt-2 font-medium">{log.message}</p>
                  {log.stack && (
                    <pre className="mt-2 overflow-auto rounded bg-muted p-2 text-sm">
                      {log.stack}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
} 