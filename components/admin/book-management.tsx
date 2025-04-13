import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

interface BookFormData {
  title: string;
  author: string;
  content: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  coverImage?: File;
}

export function BookManagement() {
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    content: '',
    difficulty: 'beginner',
  });
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First, upload the cover image if provided
      let coverImageUrl: string | undefined;
      if (formData.coverImage) {
        const fileExt = formData.coverImage.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('book-covers')
          .upload(fileName, formData.coverImage);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('book-covers')
          .getPublicUrl(fileName);
        coverImageUrl = publicUrl;
      }

      // Then, create the book record
      const { error } = await supabase
        .from('books')
        .insert({
          title: formData.title,
          author: formData.author,
          content: formData.content,
          difficulty: formData.difficulty,
          cover_image_url: coverImageUrl,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Book added successfully',
      });

      setFormData({
        title: '',
        author: '',
        content: '',
        difficulty: 'beginner',
      });
    } catch (error) {
      console.error('Error adding book:', error);
      toast({
        title: 'Error',
        description: 'Failed to add book',
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, coverImage: file }));
    }
  };

  const handleDifficultyChange = (value: string) => {
    setFormData(prev => ({ ...prev, difficulty: value as BookFormData['difficulty'] }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Add New Book</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select value={formData.difficulty} onValueChange={handleDifficultyChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="coverImage">Cover Image</Label>
          <Input
            id="coverImage"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={10}
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Book'}
        </Button>
      </form>
    </div>
  );
} 