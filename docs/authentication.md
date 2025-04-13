# Authentication System Documentation

## Overview

The Book Learning Platform uses NextAuth.js for authentication. This document provides an overview of the authentication system, how to use it, and how it's implemented.

## Authentication Flow

1. **Registration**: Users can register using email/password or Google OAuth
2. **Login**: Users can log in using their credentials or Google OAuth
3. **Session Management**: Sessions are managed using JWT strategy
4. **Protected Routes**: Routes are protected using middleware
5. **Role-Based Access**: Admin and user roles are supported

## Implementation Details

### NextAuth.js Configuration

The NextAuth.js configuration is in `lib/auth.ts`. It includes:

- Prisma adapter for database integration
- Google OAuth provider
- Credentials provider for email/password login
- JWT session strategy
- Custom callbacks for session and JWT handling

### API Routes

- `/api/auth/[...nextauth]`: Main NextAuth.js API route
- `/api/auth/session`: Session management API
- `/api/auth/_log`: Authentication logging API
- `/api/profile`: User profile management API

### Middleware

The middleware in `middleware.ts` handles:

- Protected route access
- Admin-only route access
- Redirecting unauthenticated users to login
- Redirecting authenticated users away from auth pages

## User Profile Management

Users can manage their profiles through the `/profile` page, which includes:

- Updating name
- Adding a bio
- Selecting from predefined avatars

## Role-Based Access Control

The system supports two roles:

- `USER`: Regular users with access to books, reading progress, etc.
- `ADMIN`: Administrators with access to admin panel and management features

## Environment Variables

The following environment variables are required:

```
# Database
DATABASE_URL="postgresql://..."

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## Usage Examples

### Client-Side Authentication

```tsx
import { signIn, signOut, useSession } from "next-auth/react"

// Sign in
await signIn("credentials", {
  email,
  password,
  redirect: false,
})

// Sign in with Google
await signIn("google", { callbackUrl: "/dashboard" })

// Sign out
await signOut({ callbackUrl: "/" })

// Get session
const { data: session } = useSession()
```

### Server-Side Authentication

```tsx
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

// Get session
const session = await getServerSession(authOptions)

// Check if user is authenticated
if (!session) {
  redirect("/auth/login")
}

// Check if user is admin
if (session.user.role !== "ADMIN") {
  redirect("/dashboard")
}
```

## Troubleshooting

### Common Issues

1. **Session not persisting**: Check NEXTAUTH_SECRET is set correctly
2. **Google OAuth not working**: Verify Google OAuth credentials
3. **Database connection issues**: Check DATABASE_URL is correct

### Debugging

Enable debug logs by setting:

```
DEBUG=next-auth:*
```

## Security Considerations

- Passwords are hashed using bcrypt
- JWT tokens are signed with a secret key
- CSRF protection is enabled
- Rate limiting is implemented for auth endpoints 