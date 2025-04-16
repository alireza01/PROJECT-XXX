import { PrismaClient } from '@prisma/client'

// Explicitly type the global object to include prisma
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create and export the Prisma client
export const prisma = globalForPrisma.prisma ?? new PrismaClient()

// In development, reuse the same instance to avoid too many connections
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma 