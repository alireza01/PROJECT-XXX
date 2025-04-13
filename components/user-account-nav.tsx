// @/components/user-account-nav.tsx
"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react" // Import useSession and signOut
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookMarked, LogOut, Settings, UserIcon, Loader2 } from "lucide-react" // Added Loader2
// Removed: import type { User } from "@supabase/supabase-js"
// Removed: import { useSupabaseAuth } from "@/hooks/use-supabase-auth"

// Removed the user prop, component gets session via hook
// interface UserAccountNavProps {
//   user: User // This was the Supabase User type
// }

export function UserAccountNav() {
  // Get session data using the hook
  const { data: session, status } = useSession()
  // Removed: const { signOut } = useSupabaseAuth()

  // Handle loading state
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-9 w-9">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Handle unauthenticated state (or render nothing, depending on parent logic)
  // This component likely won't be rendered by the parent if unauthenticated,
  // but adding a check just in case.
  if (status === "unauthenticated" || !session?.user) {
    // Optionally, render a login button or null
    return null;
    // Or: return <Link href="/auth/login"><Button variant="outline">ورود</Button></Link>;
  }

  // User is authenticated, access user data from session
  const user = session.user;

  // Function to handle sign out
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" }); // Redirect to home page after sign out
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* Use user data from session */}
        <Avatar className="h-9 w-9 border-2 border-primary/50 dark:border-gray-700 cursor-pointer hover:opacity-90 transition-opacity">
          <AvatarImage src={user.image ?? undefined} alt={user.name ?? user.email ?? "User Avatar"} />
          <AvatarFallback className="bg-primary/10 text-primary dark:bg-gray-800 dark:text-gray-300 font-semibold">
            {/* Use name initial if available, otherwise email initial */}
            {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-card border-border shadow-lg">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-0.5 leading-none">
             {/* Display name if available, otherwise email */}
            {user.name && <p className="font-medium text-sm text-foreground">{user.name}</p>}
            {user.email && (
              <p className={`text-xs ${user.name ? 'text-muted-foreground' : 'font-medium text-foreground'}`}>
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        {/* Links remain the same, assuming paths are correct */}
        <DropdownMenuItem asChild className="cursor-pointer focus:bg-accent">
          <Link href="/profile"> {/* Changed from /dashboard to /profile */}
            <UserIcon className="ml-2 h-4 w-4" />
            <span>پروفایل</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer focus:bg-accent">
          <Link href="/bookmarks"> {/* Changed from /dashboard/bookmarks */}
            <BookMarked className="ml-2 h-4 w-4" />
            <span>کتاب‌های نشان‌شده</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer focus:bg-accent">
          <Link href="/profile/settings"> {/* Changed from /dashboard/settings */}
            <Settings className="ml-2 h-4 w-4" />
            <span>تنظیمات</span>
          </Link>
        </DropdownMenuItem>
        {/* Admin Link - Conditionally render if user is ADMIN */}
        {user.role === 'ADMIN' && (
           <DropdownMenuItem asChild className="cursor-pointer focus:bg-accent">
             <Link href="/admin-secure-dashboard-xyz123"> {/* Ensure this path is correct */}
               {/* Add an appropriate icon like ShieldCheck */}
               <Settings className="ml-2 h-4 w-4" /> {/* Placeholder icon */}
               <span>پنل ادمین</span>
             </Link>
           </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut} // Use NextAuth signOut
          className="cursor-pointer text-red-600 dark:text-red-400 focus:bg-red-100 dark:focus:bg-red-900/20 focus:text-red-600 dark:focus:text-red-400"
        >
          <LogOut className="ml-2 h-4 w-4" />
          <span>خروج</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
