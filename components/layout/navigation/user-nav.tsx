'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function UserNav() {
  const { data: session } = useSession();

  return (
    <div className="flex items-center space-x-4">
      {session ? (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-dark">{session.user?.name}</span>
          <Button variant="ghost" asChild>
            <Link href="/profile">پروفایل</Link>
          </Button>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" asChild>
            <Link href="/auth/signin">ورود</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/signup">ثبت‌نام</Link>
          </Button>
        </div>
      )}
    </div>
  );
} 