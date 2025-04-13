import { Metadata } from 'next';
import { UserApiManager } from '@/components/user/UserApiManager';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'User Dashboard',
  description: 'Manage your Gemini API keys and settings',
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/');
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Your Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your Gemini API keys and settings
        </p>
      </div>

      <UserApiManager />
    </div>
  );
}