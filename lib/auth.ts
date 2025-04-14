// @/lib/auth.ts
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import { prisma } from "@/lib/db"
import { compare } from "bcryptjs"
import CredentialsProvider from "next-auth/providers/credentials"
import { z } from "zod"
import { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"
import { User as PrismaUser } from "@prisma/client" // Alias to avoid naming conflict
import { supabase } from "@/lib/supabase/client"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"

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
  // Augment the default User interface
  interface User {
    id: string; // Ensure id is string if overriding
    role: UserRole;
    isAdmin: boolean;
    // Default properties (name, email, image) are usually handled by DefaultUser
  }

  // Session user now automatically inherits the augmented User type
  interface Session {
    // Combine augmented User with DefaultSession user properties
    // DefaultSession["user"] provides { name, email, image }
    user: User & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  // Ensure JWT interface also includes the custom fields
  interface JWT {
    id: string; // Add id here as well
    role: UserRole;
    isAdmin: boolean;
    // Include other standard JWT fields if needed (name, email, picture)
    name?: string | null;
    email?: string | null;
    picture?: string | null;
  }
}

// Validation schema for credentials
const credentialsSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

// Export the auth configuration
export const authConfig: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Record<"email" | "password", string> | undefined) {
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
    // Use token to populate session when using JWT strategy
    async session({ session, token }) {
      if (token && session.user) {
        // Assign augmented properties from token to session.user
        // TypeScript should now recognize these properties due to User augmentation
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.isAdmin = token.isAdmin;
        // Default properties are already part of DefaultSession["user"]
        // and should be handled by NextAuth or assigned in jwt callback if needed.
        // Example: if name/email/picture are added to token in jwt callback:
        // session.user.name = token.name;
        // session.user.email = token.email;
        // session.user.image = token.picture;
      }
      return session;
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
            // Assign default role for new users, don't rely on potentially incomplete 'user' object
            role: UserRole.USER,
            isAdmin: false, // Default isAdmin status
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

export const getAuthSession = () => getServerSession(authConfig)

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
  const session = await getServerSession(authConfig);
  return session;
};