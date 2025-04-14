// @/app/api/words/[id]/route.ts
import { supabase } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data: word, error } = await supabase
      .from('words')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) throw error

    return Response.json(word)
  } catch (error) {
    console.error('Error fetching word:', error)
    return Response.json(
      { error: 'Failed to fetch word' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const { data: word, error } = await supabase
      .from('words')
      .update(body)
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

    return Response.json(word)
  } catch (error) {
    console.error('Error updating word:', error)
    return Response.json(
      { error: 'Failed to update word' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('words')
      .delete()
      .eq('id', params.id)

    if (error) throw error

    return Response.json({ success: true })
  } catch (error) {
    console.error('Error deleting word:', error)
    return Response.json(
      { error: 'Failed to delete word' },
      { status: 500 }
    )
  }
}

// TODO: Consider adding PUT/DELETE handlers for admin word management if needed via API
// Or handle these via Server Actions directly in admin components.