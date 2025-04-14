import { prisma } from '@/lib/prisma-client'
import { Level } from '@/lib/prisma-client'

// Get words for a specific page, filtered by the user's level
export async function getPageWords(pageId: string, userLevel: Level) {
  try {
    // Get all words for the page
    const words = await prisma.vocabulary.findMany({
      where: {
        bookId: pageId,
        level: {
          in: getLevelsForUser(userLevel)
        }
      }
    })
    
    return words
  } catch (error) {
    console.error("Error getting page words:", error)
    return []
  }
}

// Get all levels that should be shown to a user of a specific level
function getLevelsForUser(userLevel: Level): Level[] {
  switch (userLevel) {
    case 'BEGINNER':
      return ['BEGINNER']
    case 'INTERMEDIATE':
      return ['BEGINNER', 'INTERMEDIATE']
    case 'ADVANCED':
      return ['BEGINNER', 'INTERMEDIATE', 'ADVANCED']
    default:
      return ['BEGINNER']
  }
} 