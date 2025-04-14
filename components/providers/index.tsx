'use client';

import { ThemeProvider } from './theme-provider';
import { AuthProvider } from './auth-provider';

export interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}

// Re-export providers and hooks
export { ThemeProvider } from './theme-provider';
export { AuthProvider, useAuth } from './auth-provider'; 