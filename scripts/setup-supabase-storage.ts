import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupStorage() {
  try {
    // Create storage buckets
    const buckets = [
      { name: 'book-covers', public: true },
      { name: 'user-avatars', public: true },
      { name: 'book-content', public: false }
    ]

    for (const bucket of buckets) {
      const { data, error } = await supabase
        .storage
        .createBucket(bucket.name, {
          public: bucket.public,
          fileSizeLimit: 52428800, // 50MB
          allowedMimeTypes: bucket.name === 'book-content' 
            ? ['application/pdf', 'application/epub+zip']
            : ['image/jpeg', 'image/png', 'image/webp']
        })

      if (error) {
        console.error(`Error creating bucket ${bucket.name}:`, error)
      } else {
        console.log(`Successfully created bucket ${bucket.name}`)
      }
    }

    console.log('Storage setup completed successfully!')
  } catch (error) {
    console.error('Error setting up storage:', error)
  }
}

setupStorage() 