import NextAuth from 'next-auth'
import { authOptions } from './auth.config'

const handler = NextAuth(authOptions)

// Export the handler functions for GET and POST requests
export const GET = handler
export const POST = handler 