// @/lib/auth.ts
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { Database } from '@/types/supabase'
import { compare } from "bcryptjs"
import { z } from "zod"
import { DefaultSession, DefaultUser } from "next-auth"
import { JWT } from "next-auth/jwt"
import { User as SupabaseUser } from '@supabase/supabase-js'
import { getServerSession } from "next-auth/next"
import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { getSession } from 'next-auth/react'
import { NextApiRequest, NextApiResponse } from 'next'

// Define custom error types
export class AuthError extends Error {
  constructor(
    message: string,
    public code: string = "AUTH_ERROR",
    public status: number = 400
  ) {
    super(message)
    this.name = "AuthError"
  }
}

export class ValidationError extends AuthError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR", 400)
    this.name = "ValidationError"
  }
}

export class CredentialsError extends AuthError {
  constructor(message: string = "Invalid credentials") {
    super(message, "CREDENTIALS_ERROR", 401)
    this.name = "CredentialsError"
  }
}

// Define the UserRole type
export type UserRole = 'USER' | 'ADMIN'

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Extend the Session type to include custom properties
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;
      image: string | null;
      role: UserRole;
      isAdmin: boolean;
      credits?: number;
    } & DefaultSession["user"]
  }
}

// Auth helper functions
export async function getCurrentUser(req: NextApiRequest) {
  const session = await getSession({ req })
  if (!session?.user) return null

  const { data: user } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  return user
}

export async function requireAuth(req: NextApiRequest, res: NextApiResponse) {
  const user = await getCurrentUser(req)
  if (!user) {
    res.status(401).json({ error: 'Unauthorized' })
    return null
  }
  return user
}

export async function signInWithGoogle() {
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google`,
    },
  })
}

export async function handleAuthCallback(req: NextApiRequest) {
  const { code } = req.query
  if (!code) throw new Error('No code provided')

  const { data, error } = await supabase.auth.exchangeCodeForSession(code as string)
  if (error) throw error

  return data
}

export async function signOut() {
  return await supabase.auth.signOut()
}

export async function updateUserRole(userId: string, role: 'USER' | 'ADMIN') {
  const { data, error } = await supabase
    .from('profiles')
    .update({ role, is_admin: role === 'ADMIN' })
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteUser(userId: string) {
  const { error } = await supabase.from('profiles').delete().eq('id', userId)
  if (error) throw error
}

export async function getUsers() {
  const { data, error } = await supabase.from('profiles').select('*')
  if (error) throw error
  return data
}

export async function getUserById(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

export const authConfig: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session }) {
      if (session?.user?.email) {
        const { data: user } = await supabase
          .from("users")
          .select("*")
          .eq("email", session.user.email)
          .single()

        if (user) {
          session.user.id = user.id
          session.user.credits = user.credits
        }
      }
      return session
    },
    async signIn({ user }) {
      if (user.email) {
        const { data: existingUser } = await supabase
          .from("users")
          .select("*")
          .eq("email", user.email)
          .single()

        if (!existingUser) {
          await supabase.from("users").insert([
            {
              email: user.email,
              name: user.name,
              credits: 10, // Initial credits
            },
          ])
        }
      }
      return true
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
}

export const getAuthSession = async () => {
  const session = await getServerSession(authConfig)
  return session
}