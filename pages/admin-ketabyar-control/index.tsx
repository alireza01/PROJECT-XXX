import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';

const ADMIN_CREDENTIALS = {
  username: process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin',
  password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'ketabyar2024',
};

export default function AdminAccess() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      // Set admin session in localStorage
      localStorage.setItem('ketabyar_admin', 'true');
      router.push('/admin-ketabyar-control/dashboard');
    } else {
      setError('نام کاربری یا رمز عبور اشتباه است');
    }

    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>کتاب‌یار | ورود مدیر</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <div className="min-h-screen bg-beige flex items-center justify-center p-4">
        <Card className="w-full max-w-md animate-fade-in">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-serif text-dark">ورود به پنل مدیریت</h1>
              <p className="text-dark/60 mt-2">لطفاً برای دسترسی وارد شوید</p>
            </div>

            {error && (
              <div className="bg-error/10 text-error px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-dark mb-1">
                  نام کاربری
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-dark mb-1">
                  رمز عبور
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <Button type="submit" fullWidth loading={loading}>
              ورود
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
} 