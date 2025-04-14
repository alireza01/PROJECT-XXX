'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { UserNav } from './user-nav';
import { MobileNav } from './mobile-nav';

const navItems = [
  { label: 'خانه', href: '/' },
  { label: 'کتاب‌ها', href: '/books' },
  { label: 'پیشرفت من', href: '/progress' },
];

export function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-beige-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-serif text-dark">کتاب‌یار</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'nav-link text-base transition-colors duration-300',
                  router.pathname === item.href
                    ? 'text-gold font-medium'
                    : 'text-dark hover:text-gold'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <UserNav />
            <MobileNav isOpen={isOpen} setIsOpen={setIsOpen} />
          </div>
        </div>
      </div>
    </nav>
  );
} 