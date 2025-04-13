import type { ReactNode } from 'react'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
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