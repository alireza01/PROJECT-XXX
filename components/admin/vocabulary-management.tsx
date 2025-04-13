import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { VocabularyLevel } from '@/types';

interface VocabularyFormData {
  word: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  translation: string;
  explanation: string;
}

export function VocabularyManagement() {
  const [formData, setFormData] = useState<VocabularyFormData>({
    word: '',
    level: 'beginner',
    translation: '',
    explanation: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('vocabulary')
        .insert({
          ...formData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Vocabulary item added successfully',
      });

      setFormData({
        word: '',
        level: 'beginner',
        translation: '',
        explanation: '',
      });
    } catch (error) {
      console.error('Error adding vocabulary:', error);
      toast({
        title: 'Error',
        description: 'Failed to add vocabulary item',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLevelChange = (value: string) => {
    setFormData(prev => ({ ...prev, level: value as VocabularyFormData['level'] }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Add New Vocabulary</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="word">Word</Label>
          <Input
            id="word"
            name="word"
            value={formData.word}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="level">Level</Label>
          <Select value={formData.level} onValueChange={handleLevelChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="translation">Translation</Label>
          <Input
            id="translation"
            name="translation"
            value={formData.translation}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="explanation">Explanation</Label>
          <Textarea
            id="explanation"
            name="explanation"
            value={formData.explanation}
            onChange={handleChange}
            required
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Vocabulary'}
        </Button>
      </form>
    </div>
  );
} 