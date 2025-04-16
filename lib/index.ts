// Core exports
export { prisma } from './prisma'
export { 
  supabase,
  supabaseAdmin,
  getProfile,
  updateProfile,
  handleSupabaseResponse
} from './supabase'

// Feature exports
export { 
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  uploadBookCover,
  deleteBookCover
} from './supabase'

export {
  getReadingProgress,
  updateReadingProgress,
  getBookmarks,
  createBookmark,
  getHighlights,
  createHighlight,
  getNotes,
  createNote
} from './supabase'

export {
  getVocabulary,
  createVocabulary
} from './supabase'

// User management
export {
  getUser,
  getUserByEmail,
  createUser,
  updateUser
} from './supabase'

// Utility exports
export { formatDate, formatNumber } from './utils'
export { 
  siteConfig,
  navConfig,
  navigationItems
} from './constants'
export { fadeIn, slideIn } from './animations'
export { 
  logError,
  logInfo
} from './logger'

// Type exports
export type { Database } from './database.types' 