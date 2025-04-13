import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface ErrorLog {
  id: string;
  error: string;
  statusCode: number | null;
  timestamp: string;
  resolved: boolean;
  apiKey: {
    name: string;
  };
}

export function ErrorLogViewer() {
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);

  useEffect(() => {
    fetchErrorLogs();
  }, []);

  const fetchErrorLogs = async () => {
    try {
      const response = await fetch('/api/gemini/errors');
      const data = await response.json();
      setErrorLogs(data);
    } catch (error) {
      toast.error('Failed to fetch error logs');
    }
  };

  const handleResolveError = async (id: string) => {
    try {
      const response = await fetch(`/api/gemini/errors?id=${id}`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Failed to resolve error');
      }

      toast.success('Error marked as resolved');
      fetchErrorLogs();
    } catch (error) {
      toast.error('Failed to resolve error');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>API Error Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {errorLogs.map((log) => (
            <Card key={log.id} className={log.resolved ? 'opacity-50' : ''}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {log.resolved ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      )}
                      <span className="font-medium">{log.apiKey.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{log.error}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Status: {log.statusCode || 'Unknown'}</span>
                      <span>
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  {!log.resolved && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleResolveError(log.id)}
                    >
                      Mark as Resolved
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          {errorLogs.length === 0 && (
            <p className="text-center text-muted-foreground">
              No error logs found
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 