import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { supabase } from './auth'

export const authOptions: NextAuthOptions = {
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