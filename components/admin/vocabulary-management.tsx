import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const vocabularySchema = z.object({
  word: z.string().min(1, "کلمه الزامی است"),
  level: z.enum(["beginner", "intermediate", "advanced"], {
    required_error: "سطح کلمه الزامی است",
  }),
  translation: z.string().min(1, "ترجمه کلمه الزامی است"),
  explanation: z.string().min(1, "توضیحات کلمه الزامی است"),
});

type VocabularyFormData = z.infer<typeof vocabularySchema>;

export function VocabularyManagement() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<VocabularyFormData>({
    resolver: zodResolver(vocabularySchema),
    defaultValues: {
      word: '',
      level: 'beginner',
      translation: '',
      explanation: ''
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClientComponentClient();
  const { toast } = useToast();
  const currentLevel = watch('level');

  const handleSubmitForm = handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('vocabulary')
        .insert({
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Vocabulary added successfully',
      });

      reset();
    } catch (error) {
      console.error('Error adding vocabulary:', error);
      toast({
        title: 'Error',
        description: 'Failed to add vocabulary',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  });

  const handleLevelChange = (value: string) => {
    setValue('level', value as VocabularyFormData['level']);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Add New Vocabulary</h2>
      <form onSubmit={handleSubmitForm} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="word">Word</Label>
          <Input
            id="word"
            {...register('word')}
          />
          {errors.word && (
            <p className="text-sm text-red-500">{errors.word.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="level">Level</Label>
          <Select value={currentLevel} onValueChange={handleLevelChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
          {errors.level && (
            <p className="text-sm text-red-500">{errors.level.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="translation">Translation</Label>
          <Input
            id="translation"
            {...register('translation')}
          />
          {errors.translation && (
            <p className="text-sm text-red-500">{errors.translation.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="explanation">Explanation</Label>
          <Textarea
            id="explanation"
            {...register('explanation')}
          />
          {errors.explanation && (
            <p className="text-sm text-red-500">{errors.explanation.message}</p>
          )}
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Vocabulary'}
        </Button>
      </form>
    </div>
  );
} 