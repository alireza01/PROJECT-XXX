import { ReactNode } from 'react';
import { Inter, Playfair_Display } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={`min-h-screen bg-beige ${inter.variable} ${playfair.variable} font-sans`}>
      <div className="animate-fade-in">
        {children}
      </div>
    </div>
  );
} 