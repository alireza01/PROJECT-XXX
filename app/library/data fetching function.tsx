// @/lib/data.ts

// Define our types
export interface Book {
  id: string;
  title: string;
  author: {
    id: string;
    name: string;
  };
  coverUrl: string;
  level: "beginner" | "intermediate" | "advanced";
  category: {
    id: string;
    name: string;
  };
  description: string;
  pageCount: number;
  rating: number;
  readingTime: number;
}

export interface Category {
  id: string;
  name: string;
  count: number;
}

interface BookQueryParams {
  query?: string;
  category?: string;
  level?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}

interface BookQueryResult {
  items: Book[];
  total: number;
}

// Mock categories data
const mockCategories: Category[] = [
  { id: "fiction", name: "داستانی", count: 42 },
  { id: "self-help", name: "توسعه فردی", count: 28 },
  { id: "business", name: "کسب و کار", count: 15 },
  { id: "romance", name: "عاشقانه", count: 23 },
  { id: "biography", name: "زندگینامه", count: 17 },
];

// Mock books data generator
const generateMockBooks = (count: number): Book[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `book-${i + 1}`,
    title: `کتاب نمونه ${i + 1}`,
    author: {
      id: `author-${(i % 5) + 1}`,
      name: ["جیمز کلیر", "هارپر لی", "جی.کی. رولینگ", "جورج اورول", "آنتوان دو سنت اگزوپری"][i % 5],
    },
    coverUrl: `/placeholder.svg?height=256&width=384&text=Book${i + 1}`,
    level: ["beginner", "intermediate", "advanced"][i % 3] as "beginner" | "intermediate" | "advanced",
    category: {
      id: `category-${(i % 5) + 1}`,
      name: ["داستانی", "توسعه فردی", "کسب و کار", "عاشقانه", "زندگینامه"][i % 5],
    },
    description: "این یک توضیح نمونه برای کتاب است. در یک پیاده‌سازی واقعی، این متن از دیتابیس خوانده می‌شود.",
    pageCount: 100 + i * 20,
    rating: 3.5 + Math.random() * 1.5,
    readingTime: 60 + i * 15,
  }));
};

// Get all categories
export async function getCategories(): Promise<Category[]> {
  try {
    // In a real implementation, this would be a database query
    // return await db.category.findMany({
    //   select: {
    //     id: true,
    //     name: true,
    //     _count: {
    //       select: { books: true }
    //     }
    //   }
    // }).then(categories => categories.map(c => ({
    //   id: c.id,
    //   name: c.name,
    //   count: c._count.books
    // })));
    
    // For now, return mock data
    return mockCategories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
}

// Get books with filtering, sorting, and pagination
export async function getBooks(params: BookQueryParams): Promise<BookQueryResult> {
  const { query, category, level, sort, page = 1, pageSize = 12 } = params;
  
  try {
    // In a real implementation, this would be a database query with filtering
    // const where = {
    //   ...(query ? { OR: [{ title: { contains: query } }, { description: { contains: query } }] } : {}),
    //   ...(category ? { categoryId: category } : {}),
    //   ...(level ? { level: level } : {})
    // };
    
    // const orderBy = sort === 'newest' 
    //   ? { createdAt: 'desc' } 
    //   : sort === 'rating' 
    //     ? { rating: 'desc' } 
    //     : { title: 'asc' };
    
    // const [items, total] = await Promise.all([
    //   db.book.findMany({
    //     where,
    //     orderBy,
    //     skip: (page - 1) * pageSize,
    //     take: pageSize,
    //     include: {
    //       author: true,
    //       category: true
    //     }
    //   }),
    //   db.book.count({ where })
    // ]);
    
    // return { items, total };
    
    // For now, simulate filtering and return mock data
    let mockBooks = generateMockBooks(120);
    
    // Apply filters
    if (query) {
      mockBooks = mockBooks.filter(book => 
        book.title.includes(query) || book.description.includes(query)
      );
    }
    
    if (category) {
      mockBooks = mockBooks.filter(book => book.category.id === category);
    }
    
    if (level) {
      mockBooks = mockBooks.filter(book => book.level === level);
    }
    
    // Apply sorting
    if (sort === 'newest') {
      // Sort by id descending as a proxy for newness
      mockBooks.sort((a, b) => parseInt(b.id.split('-')[1]) - parseInt(a.id.split('-')[1]));
    } else if (sort === 'rating') {
      mockBooks.sort((a, b) => b.rating - a.rating);
    } else {
      // Default sort by title
      mockBooks.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    const total = mockBooks.length;
    const start = (page - 1) * pageSize;
    const items = mockBooks.slice(start, start + pageSize);
    
    return { items, total };
  } catch (error) {
    console.error("Error fetching books:", error);
    throw new Error("Failed to fetch books");
  }
}