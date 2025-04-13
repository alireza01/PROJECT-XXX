import type { AppProps } from 'next/app';
import { Inter, Playfair_Display } from 'next/font/google';
import Layout from '@/components/layout/Layout';
import Navigation from '@/components/layout/Navigation';
import '@/styles/globals.css';

// Font configuration
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${inter.variable} ${playfair.variable}`}>
      <Layout>
        <Navigation />
        <main className="pt-16">
          <Component {...pageProps} />
        </main>
      </Layout>
    </div>
  );
} 