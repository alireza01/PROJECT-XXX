"use client"

import { useState, useEffect } from "react";
import { WordManagement } from "@/v2/components/admin/word-management";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

type WordLevel = "beginner" | "intermediate" | "advanced";

interface Word {
  id: string;
  word: string;
  meaning: string;
  explanation: string;
  level: WordLevel;
  createdAt: string;
  updatedAt: string;
  original?: string;
  category?: string;
  example?: string;
  pronunciation?: string;
}

export default function WordsManagementPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newWord, setNewWord] = useState<Partial<Word>>({});
  const { toast } = useToast();

  const handleAddWord = async (data: { word: string; meaning: string; explanation: string; level: WordLevel }) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('words')
        .insert([{ ...data, updatedAt: new Date().toISOString() }]);

      if (error) throw error;
      toast.success('Word added successfully');
      // Refresh words list
      fetchWords();
    } catch (error) {
      toast.error('Failed to add word');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateWord = async (id: string, data: Partial<Word>) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('words')
        .update({ ...data, updatedAt: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      toast.success('Word updated successfully');
      // Refresh words list
      fetchWords();
    } catch (error) {
      toast.error('Failed to update word');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteWord = async (id: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('words')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Word deleted successfully');
      // Refresh words list
      fetchWords();
    } catch (error) {
      toast.error('Failed to delete word');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWords = async () => {
    try {
      const { data, error } = await supabase
        .from('words')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) throw error;
      setWords(data || []);
    } catch (error) {
      toast.error('Failed to fetch words');
    }
  };

  // Fetch words on component mount
  useEffect(() => {
    fetchWords();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("words").insert([newWord]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Word added successfully",
      });

      setNewWord({});
      fetchWords();
    } catch (error) {
      console.error("Error adding word:", error);
      toast({
        title: "Error",
        description: "Failed to add word",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Manage Words</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="word">Word</Label>
          <Input
            id="word"
            value={newWord.word || ""}
            onChange={(e) => setNewWord({ ...newWord, word: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="meaning">Meaning</Label>
          <Input
            id="meaning"
            value={newWord.meaning || ""}
            onChange={(e) => setNewWord({ ...newWord, meaning: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="level">Level</Label>
          <select
            id="level"
            value={newWord.level || "beginner"}
            onChange={(e) =>
              setNewWord({
                ...newWord,
                level: e.target.value as WordLevel,
              })
            }
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
            required
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div>
          <Label htmlFor="category">Category (Optional)</Label>
          <Input
            id="category"
            value={newWord.category || ""}
            onChange={(e) => setNewWord({ ...newWord, category: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="example">Example (Optional)</Label>
          <Input
            id="example"
            value={newWord.example || ""}
            onChange={(e) => setNewWord({ ...newWord, example: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="pronunciation">Pronunciation (Optional)</Label>
          <Input
            id="pronunciation"
            value={newWord.pronunciation || ""}
            onChange={(e) =>
              setNewWord({ ...newWord, pronunciation: e.target.value })
            }
          />
        </div>

        <Button type="submit">Add Word</Button>
      </form>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Word List</h2>
        <div className="space-y-4">
          {words.map((word) => (
            <div
              key={word.id}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-medium">{word.word}</h3>
              <p className="text-gray-600">{word.meaning}</p>
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                <span>Level: {word.level}</span>
                {word.category && <span>• Category: {word.category}</span>}
              </div>
              {word.example && (
                <p className="mt-2 text-sm italic">Example: {word.example}</p>
              )}
              {word.pronunciation && (
                <p className="mt-1 text-sm">
                  Pronunciation: {word.pronunciation}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}