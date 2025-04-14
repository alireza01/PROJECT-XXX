import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

export default async function VocabularyPage() {
  const supabase = createServerComponentClient<Database>({ cookies })
  
  const { data: vocabulary, error } = await supabase
    .from('vocabulary')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching vocabulary:', error)
    return <div>Error loading vocabulary</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Vocabulary</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vocabulary?.map((item) => (
          <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2">{item.word}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{item.definition}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Level: {item.level}
              </span>
              {item.category && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Category: {item.category}
                </span>
              )}
            </div>
            {item.example && (
              <p className="mt-4 text-sm italic text-gray-600 dark:text-gray-300">
                Example: {item.example}
              </p>
            )}
            {item.pronunciation && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Pronunciation: {item.pronunciation}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
