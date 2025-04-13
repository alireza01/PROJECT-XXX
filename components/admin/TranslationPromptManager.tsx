import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';
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

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const response = await fetch('/api/gemini/prompts');
      const data = await response.json();
      setPrompts(data);
    } catch (error) {
      toast.error('Failed to fetch translation prompts');
    }
  };

  const handleAddPrompt = async () => {
    if (!newName || !newPrompt) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('/api/gemini/prompts', {
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

      if (!response.ok) {
        throw new Error('Failed to add translation prompt');
      }

      toast.success('Translation prompt added successfully');
      setNewName('');
      setNewPrompt('');
      setIsDefault(false);
      fetchPrompts();
    } catch (error) {
      toast.error('Failed to add translation prompt');
    }
  };

  const handleDeletePrompt = async (id: string) => {
    try {
      const response = await fetch(`/api/gemini/prompts?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete translation prompt');
      }

      toast.success('Translation prompt deleted successfully');
      fetchPrompts();
    } catch (error) {
      toast.error('Failed to delete translation prompt');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Translation Prompts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-4">
            <Input
              placeholder="Prompt Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <Textarea
              placeholder="Enter the translation prompt..."
              value={newPrompt}
              onChange={(e) => setNewPrompt(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex items-center space-x-2">
              <Switch
                id="default"
                checked={isDefault}
                onCheckedChange={setIsDefault}
              />
              <Label htmlFor="default">Default Prompt</Label>
            </div>
            <Button onClick={handleAddPrompt}>
              <Plus className="mr-2 h-4 w-4" />
              Add Prompt
            </Button>
          </div>

          <div className="space-y-4">
            {prompts.map((prompt) => (
              <Card key={prompt.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {prompt.isDefault && (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        )}
                        <span className="font-medium">{prompt.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {prompt.prompt}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeletePrompt(prompt.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {prompts.length === 0 && (
              <p className="text-center text-muted-foreground">
                No translation prompts found
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 