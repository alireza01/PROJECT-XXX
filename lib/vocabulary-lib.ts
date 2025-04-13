import { prisma } from '@/lib/prisma'
import { Level } from '@prisma/client'

// Get words for a specific page, filtered by the user's level
export async function getPageWords(pageId: string, userLevel: Level) {
  try {
    const words = await prisma.bookWordPosition.findMany({
      where: {
        pageId,
        explanation: {
          difficultyLevel: {
            // Show words at or below the user's level
            in: getLevelsForUser(userLevel),
          },
        },
      },
      include: {
        word: true,
        explanation: true,
      },
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

// Get a specific explanation by ID
export async function getWordExplanation(explanationId: string) {
  try {
    const explanation = await prisma.explanation.findUnique({
      where: {
        id: explanationId,
      },
      include: {
        word: true,
      },
    })
    
    return explanation
  } catch (error) {
    console.error("Error getting word explanation:", error)
    return null
  }
}

// Add a new word with explanation
export async function addWord(
  word: string,
  persianMeaning: string,
  difficultyLevel: Level,
  explanation?: string, 
  example?: string,
  pronunciation?: string
) {
  try {
    // Check if word already exists
    let wordRecord = await prisma.word.findUnique({
      where: {
        word,
      },
    })
    
    // If word doesn't exist, create it
    if (!wordRecord) {
      wordRecord = await prisma.word.create({
        data: {
          word,
          pronunciation,
        },
      })
    }
    
    // Create explanation
    const explanationRecord = await prisma.explanation.create({
      data: {
        wordId: wordRecord.id,
        difficultyLevel,
        persianMeaning,
        explanation,
        example,
      },
    })
    
    return {
      word: wordRecord,
      explanation: explanationRecord,
    }
  } catch (error) {
    console.error("Error adding word:", error)
    throw error
  }
}

// Tag a word in a book page
export async function tagWordInPage(
  pageId: string,
  wordId: string,
  explanationId: string,
  startOffset: number,
  endOffset: number
) {
  try {
    const position = await prisma.bookWordPosition.create({
      data: {
        pageId,
        wordId,
        explanationId,
        startOffset,
        endOffset,
      },
    })
    
    return position
  } catch (error) {
    console.error("Error tagging word in page:", error)
    throw error
  }
}
