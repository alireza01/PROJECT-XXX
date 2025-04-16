export const siteConfig = {
  name: "Ketab Yar",
  description: "A modern book sharing and reading platform",
  url: process.env.NEXT_PUBLIC_APP_URL,
  ogImage: "https://ketabyar.com/og.jpg",
  links: {
    twitter: "https://twitter.com/ketabyar",
    github: "https://github.com/ketabyar",
  },
}

export const navigationConfig = {
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Books",
      href: "/books",
    },
    {
      title: "Library",
      href: "/library",
    },
    {
      title: "About",
      href: "/about",
    },
  ],
}

export const bookCategories = [
  "Fiction",
  "Non-Fiction",
  "Science",
  "Technology",
  "History",
  "Biography",
  "Poetry",
  "Drama",
  "Mystery",
  "Romance",
  "Fantasy",
  "Science Fiction",
  "Self-Help",
  "Business",
  "Education",
  "Other"
] as const

export type BookCategory = typeof bookCategories[number]

export const userRoles = {
  ADMIN: "admin",
  USER: "user",
  MODERATOR: "moderator",
} as const

export type UserRole = typeof userRoles[keyof typeof userRoles]

export const apiEndpoints = {
  books: "/api/books",
  users: "/api/users",
  auth: "/api/auth",
  search: "/api/search",
} as const

export const paginationConfig = {
  defaultPageSize: 10,
  maxPageSize: 100,
} as const

export const validationConfig = {
  maxTitleLength: 100,
  maxDescriptionLength: 500,
  maxCommentLength: 1000,
  allowedImageTypes: ["image/jpeg", "image/png", "image/webp"],
  maxImageSize: 5 * 1024 * 1024, // 5MB
} as const 