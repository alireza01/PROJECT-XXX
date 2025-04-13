import { Book } from "@/types/book"

export interface BookQueryParams {
  page?: number
  category?: string
  search?: string
  limit?: number
}

export interface BookQueryResult {
  books: Book[]
  total: number
}

export interface Category {
  id: string
  name: string
  slug: string
}

// This is a mock implementation. Replace with actual API calls in production.
export async function getBooks({
  page = 1,
  category,
  search,
  limit = 12,
}: BookQueryParams): Promise<BookQueryResult> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock data - replace with actual API call
  const mockBooks: Book[] = [
    {
      id: "1",
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      coverImage: "/books/gatsby.jpg",
      rating: 4.5,
      description: "A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.",
      category: "fiction",
      publishedAt: "1925-04-10",
      isbn: "978-0743273565",
      pageCount: 180,
      language: "English",
      publisher: "Scribner",
    },
    {
      id: "2",
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      coverImage: "/books/mockingbird.jpg",
      rating: 4.8,
      description: "The story of racial injustice and the loss of innocence in the American South.",
      category: "fiction",
      publishedAt: "1960-07-11",
      isbn: "978-0446310789",
      pageCount: 281,
      language: "English",
      publisher: "Grand Central Publishing",
    },
    {
      id: "3",
      title: "A Brief History of Time",
      author: "Stephen Hawking",
      coverImage: "/books/brief-history.jpg",
      rating: 4.6,
      description: "An exploration of modern physics and the universe's biggest mysteries.",
      category: "science",
      publishedAt: "1988-04-01",
      isbn: "978-0553380163",
      pageCount: 256,
      language: "English",
      publisher: "Bantam",
    },
  ]

  // Filter books based on search and category
  let filteredBooks = mockBooks
  if (search) {
    filteredBooks = filteredBooks.filter(
      (book) =>
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase())
    )
  }
  if (category) {
    filteredBooks = filteredBooks.filter((book) => book.category === category)
  }

  // Calculate pagination
  const start = (page - 1) * limit
  const end = start + limit
  const paginatedBooks = filteredBooks.slice(start, end)

  return {
    books: paginatedBooks,
    total: filteredBooks.length,
  }
}

export async function getCategories(): Promise<Category[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Mock data - replace with actual API call
  return [
    { id: "1", name: "Fiction", slug: "fiction" },
    { id: "2", name: "Non-Fiction", slug: "non-fiction" },
    { id: "3", name: "Science", slug: "science" },
    { id: "4", name: "History", slug: "history" },
    { id: "5", name: "Biography", slug: "biography" },
  ]
} 