import { Metadata } from 'next';
import { ApiKeyManager } from '@/components/admin/ApiKeyManager';
import { ErrorLogViewer } from '@/components/admin/ErrorLogViewer';
import { TranslationPromptManager } from '@/components/admin/TranslationPromptManager';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Manage Gemini API keys and translation settings',
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    redirect('/');
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage Gemini API keys, error logs, and translation settings
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <ApiKeyManager />
        <ErrorLogViewer />
      </div>

      <TranslationPromptManager />
    </div>
  );
} 