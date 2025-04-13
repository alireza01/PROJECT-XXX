import { PrismaClient } from '@prisma/client'

export async function testConnection(): Promise<boolean> {
  const prisma = new PrismaClient()
  
  try {
    // Try to query something simple
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ Database connection successful!')
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return false
  } finally {
    await prisma.$disconnect()
  }
} 