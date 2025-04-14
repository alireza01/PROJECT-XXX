import { ReactNode } from 'react';
import { Inter, Playfair_Display } from 'next/font/google';
import { SiteHeader } from './site-header';
import { SiteFooter } from './site-footer';
import { Sidebar } from './sidebar';
import { AuthProvider } from '../auth-provider';
import { ThemeProvider } from '../theme-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export default function Layout({ children, showSidebar = false }: LayoutProps) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <div className={`min-h-screen bg-beige ${inter.variable} ${playfair.variable} font-sans`}>
          <SiteHeader />
          <div className="flex">
            {showSidebar && <Sidebar />}
            <main className="flex-1 pt-16">
              <div className="animate-fade-in">
                {children}
              </div>
            </main>
          </div>
          <SiteFooter />
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
} 