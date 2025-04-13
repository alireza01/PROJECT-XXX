"use client"

import { useState, useEffect } from "react";
import { Metadata } from "next";
import { WordManagement } from "@/v2/components/admin/word-management";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";

// Define metadata for the page
export const metadata: Metadata = {
  title: "مدیریت واژگان | Admin Dashboard",
  description: "Page for managing vocabulary words",
};

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
}

export default function WordsManagementPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">مدیریت واژگان</h1>
        <p className="text-gray-600 text-sm">
          Add, edit, or remove vocabulary words from the system
        </p>
      </div>
      
      <WordManagement
        words={words}
        onAddWord={handleAddWord}
        onUpdateWord={handleUpdateWord}
        onDeleteWord={handleDeleteWord}
        isLoading={isLoading}
      />
    </div>
  );
}