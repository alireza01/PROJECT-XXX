import { Prisma } from '@prisma/client'

export type Book = Prisma.BookGetPayload<{
  include: {
    author: true
    categories: true
    vocabulary: true
  }
}> 