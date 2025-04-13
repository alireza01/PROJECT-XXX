// @/lib/supabase/client.ts
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase" // Assuming this type definition is still relevant for DB structure

// Get Supabase URL and Anon Key from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if environment variables are set
if (!supabaseUrl) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
}
if (!supabaseAnonKey) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

// Create and export the Supabase client instance
// This client can be used for Storage, Database (if needed alongside Prisma), etc.
// It does NOT handle authentication specific logic like the old auth-helpers.
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Note: This is a singleton instance. If you were using the previous function
// createClient() elsewhere, you'll need to update those calls to use this
// exported 'supabase' instance directly.
