import { PrismaClient } from '@prisma/client';

// Declare a global variable to hold the Prisma Client instance.
// This is necessary because in development, Next.js clears the Node.js module cache on every request,
// which would otherwise lead to multiple Prisma Client instances being created.
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Initialize Prisma Client.
// If we're in production or the global prisma instance doesn't exist, create a new one.
// Otherwise, use the existing global instance.
export const prisma =
  global.prisma ||
  new PrismaClient({
    // Optional: Add logging configuration if needed
    // log: ['query', 'info', 'warn', 'error'],
  });

// In development, assign the created Prisma Client instance to the global variable.
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Export the singleton instance as the default export
export default prisma;
