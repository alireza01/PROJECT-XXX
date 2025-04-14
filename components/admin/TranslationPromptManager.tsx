'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface TranslationPrompt {
  id: string;
  name: string;
  prompt: string;
  isDefault: boolean;
}

export function TranslationPromptManager() {
  const [prompts, setPrompts] = useState<TranslationPrompt[]>([]);
  const [newName, setNewName] = useState('');
  const [newPrompt, setNewPrompt] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/translation-prompts');
      if (response.ok) {
        const data = await response.json();
        setPrompts(data.prompts);
      }
    } catch (error) {
      console.error('Error fetching prompts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPrompt = async () => {
    if (!newName || !newPrompt) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/translation-prompts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newName,
          prompt: newPrompt,
          isDefault,
        }),
      });

      if (response.ok) {
        toast.success('Prompt added successfully');
        setNewName('');
        setNewPrompt('');
        setIsDefault(false);
        fetchPrompts();
      } else {
        throw new Error('Failed to add prompt');
      }
    } catch (error) {
      toast.error('Error adding prompt');
      console.error('Error adding prompt:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePrompt = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/translation-prompts?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Prompt deleted successfully');
        fetchPrompts();
      } else {
        throw new Error('Failed to delete prompt');
      }
    } catch (error) {
      toast.error('Error deleting prompt');
      console.error('Error deleting prompt:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Translation Prompts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Prompt Name</Label>
              <Input
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter prompt name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prompt">Prompt Text</Label>
              <Textarea
                id="prompt"
                value={newPrompt}
                onChange={(e) => setNewPrompt(e.target.value)}
                placeholder="Enter prompt text"
                rows={4}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
              />
              <Label htmlFor="isDefault">Set as default prompt</Label>
            </div>
            <Button onClick={handleAddPrompt} disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Prompt'}
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Existing Prompts</h3>
            {prompts.map((prompt) => (
              <div key={prompt.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{prompt.name}</h4>
                    {prompt.isDefault && (
                      <span className="text-xs text-muted-foreground">
                        Default Prompt
                      </span>
                    )}
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeletePrompt(prompt.id)}
                  >
                    Delete
                  </Button>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {prompt.prompt}
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 