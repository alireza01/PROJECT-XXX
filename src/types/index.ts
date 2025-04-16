import { type BookCategory, type UserRole } from "@/lib/constants"

export interface User {
  id: string
  name: string
  email: string
  image?: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export interface Book {
  id: string
  title: string
  description: string
  author: string
  category: BookCategory
  coverImage?: string
  publishedYear: number
  isbn?: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface Comment {
  id: string
  content: string
  userId: string
  bookId: string
  createdAt: Date
  updatedAt: Date
}

export interface Review {
  id: string
  rating: number
  content: string
  userId: string
  bookId: string
  createdAt: Date
  updatedAt: Date
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface SearchParams extends PaginationParams {
  query?: string
  category?: BookCategory
  author?: string
  year?: number
}

export type ApiResponse<T> = {
  data: T
  message?: string
  error?: string
}

export type ApiError = {
  message: string
  code: string
  status: number
}

export interface FileUploadResponse {
  url: string
  filename: string
  size: number
  mimeType: string
}

export interface AuthResponse {
  user: User
  token: string
  expiresIn: number
} 