import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials')
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupDatabase() {
  try {
    // Create tables if they don't exist
    const { error: booksError } = await supabase.rpc('create_books_table')
    const { error: usersError } = await supabase.rpc('create_users_table')
    const { error: vocabularyError } = await supabase.rpc('create_vocabulary_table')
    const { error: progressError } = await supabase.rpc('create_progress_table')

    if (booksError) throw booksError
    if (usersError) throw usersError
    if (vocabularyError) throw vocabularyError
    if (progressError) throw progressError

    console.log('Database setup completed successfully')
  } catch (error) {
    console.error('Error setting up database:', error)
    process.exit(1)
  }
}

setupDatabase() 