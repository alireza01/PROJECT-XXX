import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';

export default async function AdminLoginPage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role === "admin") {
    redirect('/admin');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">ورود به پنل مدیریت</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            لطفا اطلاعات ورود را وارد کنید
          </p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  );
} 