// @/lib/auth.ts
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import type { DefaultSession, NextAuthOptions } from "next-auth"
import { getServerSession } from "next-auth/next"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/lib/prisma-client"
import { compare } from "bcryptjs"
import { z } from "zod"
import { supabase } from "@/lib/supabase/client"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

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
export const UserRole = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const

export type UserRole = typeof UserRole[keyof typeof UserRole]

// Extend the default NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: UserRole
      isAdmin: boolean
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role: UserRole
    isAdmin: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: UserRole
    isAdmin: boolean
  }
}

// Validation schema for credentials
const credentialsSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Validate credentials
          const result = credentialsSchema.safeParse(credentials)
          if (!result.success) {
            throw new ValidationError("Invalid input data")
          }

          const { email, password } = result.data

          // Find user
          const user = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              name: true,
              image: true,
              password: true,
              role: true,
              isAdmin: true,
            },
          })

          if (!user || !user.password) {
            throw new CredentialsError()
          }

          // Verify password
          const isValid = await compare(password, user.password)
          if (!isValid) {
            throw new CredentialsError()
          }

          // Return user without password
          const { password: _, ...userWithoutPassword } = user
          return userWithoutPassword
        } catch (error) {
          if (error instanceof AuthError) {
            throw error
          }
          if (error instanceof z.ZodError) {
            throw new ValidationError("Invalid input data")
          }
          console.error("Auth error:", error)
          throw new AuthError("An unexpected error occurred")
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        session.user.role = user.role
        session.user.isAdmin = user.isAdmin
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.isAdmin = user.isAdmin
      }
      return token
    },
    async signIn({ user }) {
      // Check if user exists in database
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email! },
      })

      if (!existingUser) {
        // Create new user
        await prisma.user.create({
          data: {
            email: user.email!,
            name: user.name!,
            image: user.image,
            role: user.role,
            isAdmin: false,
          },
        })
      }

      return true
    },
  },
  events: {
    async signIn({ user }) {
      try {
        // Update last login timestamp
        await prisma.user.update({
          where: { id: user.id },
          data: { updatedAt: new Date() },
        })
      } catch (error) {
        console.error("Error updating last login:", error)
      }
    }
  },
}

export const getAuthSession = () => getServerSession(authOptions)

export interface User {
  id: string
  email: string
  name: string | null
  role: UserRole
  image: string | null
  createdAt: string
  lastLogin: string | null
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error || !session) return null

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", session.user.id)
      .single()

    if (userError || !user) return null

    // Update last login
    await supabase
      .from("users")
      .update({ last_login: new Date().toISOString() })
      .eq("id", user.id)

    return user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export async function requireAuth(role?: UserRole) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.redirect(new URL("/auth/login", process.env.NEXT_PUBLIC_APP_URL))
  }

  if (role && user.role !== role) {
    return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL))
  }

  return user
}

export async function signInWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    })

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error signing in with Google:", error)
    throw error
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error) {
    console.error("Error signing out:", error)
    throw error
  }
}

export async function handleAuthCallback() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error || !session) throw new Error("No session found")

    // Check if user exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("id", session.user.id)
      .single()

    if (!existingUser) {
      // Create new user
      const { error: createError } = await supabase
        .from("users")
        .insert({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata.full_name,
          role: "USER",
          image: session.user.user_metadata.avatar_url,
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
        })

      if (createError) throw createError
    }

    return session
  } catch (error) {
    console.error("Error handling auth callback:", error)
    throw error
  }
}

export async function updateUserRole(userId: string, role: UserRole) {
  try {
    const { error } = await supabase
      .from("users")
      .update({ role })
      .eq("id", userId)

    if (error) throw error
  } catch (error) {
    console.error("Error updating user role:", error)
    throw error
  }
}

export async function deleteUser(userId: string) {
  try {
    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", userId)

    if (error) throw error
  } catch (error) {
    console.error("Error deleting user:", error)
    throw error
  }
}

export async function getUsers() {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error getting users:", error)
    throw error
  }
}

export async function getUserById(userId: string) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error getting user by ID:", error)
    throw error
  }
}

export const auth = async () => {
  const session = await getServerSession(authOptions);
  return session;
};