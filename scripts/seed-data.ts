import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials')
}

const supabase = createClient(supabaseUrl, supabaseKey)

const sampleBooks = [
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.',
    cover_url: '/public/placeholder.jpg',
    content: 'Sample book content...',
    difficulty_level: 'intermediate',
  },
  // Add more sample books as needed
]

const sampleVocabulary = [
  {
    word: 'fabulous',
    level: 'intermediate',
    persian_meaning: 'فوق‌العاده، شگفت‌انگیز',
    example_sentence: 'The party was absolutely fabulous.',
    book_id: 1,
  },
  // Add more sample vocabulary as needed
]

async function seedData() {
  try {
    // Insert sample books
    const { error: booksError } = await supabase
      .from('books')
      .insert(sampleBooks)

    // Insert sample vocabulary
    const { error: vocabularyError } = await supabase
      .from('vocabulary')
      .insert(sampleVocabulary)

    if (booksError) throw booksError
    if (vocabularyError) throw vocabularyError

    console.log('Data seeding completed successfully')
  } catch (error) {
    console.error('Error seeding data:', error)
    process.exit(1)
  }
}

seedData() 