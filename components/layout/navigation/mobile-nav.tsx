"use client"

import { Dispatch, SetStateAction } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import clsx from 'clsx';

const navItems = [
  { label: 'خانه', href: '/' },
  { label: 'کتاب‌ها', href: '/books' },
  { label: 'پیشرفت من', href: '/progress' },
];

interface MobileNavProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function MobileNav({ isOpen, setIsOpen }: MobileNavProps) {
  const router = useRouter();

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 hover:bg-beige rounded-full transition-colors duration-300"
      >
        <svg
          className="w-6 h-6 text-dark"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-beige-dark">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'block px-3 py-2 rounded-lg text-base transition-colors duration-300',
                  router.pathname === item.href
                    ? 'bg-gold/10 text-gold font-medium'
                    : 'text-dark hover:bg-beige hover:text-gold'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
} 