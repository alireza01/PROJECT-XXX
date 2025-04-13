import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SettingsForm } from '@/components/admin/settings-form';

export default async function SettingsPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/admin/login');
  }

  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (!userData || userData.role !== 'admin') {
    redirect('/admin/login');
  }

  const { data: settings } = await supabase
    .from('settings')
    .select('*')
    .single();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">تنظیمات سایت</h1>
      <SettingsForm initialSettings={settings} />
    </div>
  );
} 