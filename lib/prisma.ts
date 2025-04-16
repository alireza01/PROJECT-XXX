import { PrismaClient } from '@prisma/client'

// Create a singleton instance of PrismaClient
const prismaClientSingleton = () => {
  return new PrismaClient()
}

// Define the global type
declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

// Export the prisma client
const prisma = globalThis.prisma ?? prismaClientSingleton()

// In development, reuse the same instance
if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma

// Export with explicit type assertion
export { prisma } 