'use client';

import { Toaster } from 'sonner';
import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';
import PerformanceProvider from './performance-provider';
import NextAuthProvider from './session-provider';

export function RootProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextAuthProvider>
      <NextThemesProvider {...props}>
        <PerformanceProvider>
          {children}
          <Toaster position="top-right" richColors />
        </PerformanceProvider>
      </NextThemesProvider>
    </NextAuthProvider>
  );
} 