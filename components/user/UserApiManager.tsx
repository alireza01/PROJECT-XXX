import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  isActive: boolean;
  isDefault: boolean;
}

export function UserApiManager() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKey, setNewKey] = useState('');
  const [newName, setNewName] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const response = await fetch('/api/gemini');
      const data = await response.json();
      setApiKeys(data);
    } catch (error) {
      toast.error('Failed to fetch API keys');
    }
  };

  const handleAddKey = async () => {
    if (!newKey || !newName) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: newKey,
          name: newName,
          isDefault,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add API key');
      }

      toast.success('API key added successfully');
      setNewKey('');
      setNewName('');
      setIsDefault(false);
      fetchApiKeys();
    } catch (error) {
      toast.error('Failed to add API key');
    }
  };

  const handleDeleteKey = async (id: string) => {
    try {
      const response = await fetch(`/api/gemini?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete API key');
      }

      toast.success('API key deleted successfully');
      fetchApiKeys();
    } catch (error) {
      toast.error('Failed to delete API key');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Gemini API Keys</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="API Key Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <Input
              placeholder="API Key"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
            />
            <div className="flex items-center space-x-2">
              <Switch
                id="default"
                checked={isDefault}
                onCheckedChange={setIsDefault}
              />
              <Label htmlFor="default">Default</Label>
            </div>
            <Button onClick={handleAddKey}>
              <Plus className="mr-2 h-4 w-4" />
              Add Key
            </Button>
          </div>

          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <Card key={apiKey.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">{apiKey.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {apiKey.key.substring(0, 8)}...
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      {apiKey.isDefault && (
                        <div className="flex items-center text-green-500">
                          <CheckCircle2 className="mr-1 h-4 w-4" />
                          <span className="text-xs">Default</span>
                        </div>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteKey(apiKey.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {apiKeys.length === 0 && (
              <p className="text-center text-muted-foreground">
                No API keys found. Add your first API key to get started.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 