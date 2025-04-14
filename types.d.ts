import type { ReactNode } from 'react';
import type { UserRole } from '@/lib/auth'; // Import UserRole

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}

// Augment NextAuth types
declare module 'next-auth' {
  /**
   * Extends the built-in User model
   */
  interface User {
    id: string;
    role: UserRole;
    isAdmin: boolean;
    // Keep other default fields if needed, or let them be inherited
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }

  /**
   * Extends the built-in Session model
   */
  interface Session {
    user: User; // Use the augmented User type here
  }
}

// Augment JWT type
declare module 'next-auth/jwt' {
  /** Extends the built-in JWT type */
  interface JWT {
    id: string;
    role: UserRole;
    isAdmin: boolean;
    // Keep other default fields if needed
    name?: string | null;
    email?: string | null;
    picture?: string | null;
    sub?: string;
  }
}

declare module 'next-auth/providers/credentials' {
  export default function CredentialsProvider(options: any): any
}

declare module 'next-auth/providers/google' {
  export default function GoogleProvider(options: any): any
}

declare module 'next-auth/next' {
  export function getServerSession(options: any): Promise<any>
}

declare module '@next-auth/prisma-adapter' {
  export function PrismaAdapter(options: any): any
}

declare module 'bcryptjs' {
  export function compare(password: string, hash: string): Promise<boolean>
}

declare module 'zod' {
  export const z: any
}

declare module 'next/headers' {
  export const cookies: any
}

declare module 'next/server' {
  export class NextResponse {
    static redirect(url: string | URL): any
  }
} 