import { hash } from 'bcryptjs'
import { createUser, getUserByEmail } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    // Validate input
    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'User already exists' }),
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create user in Supabase
    const user = await createUser({
      name,
      email,
      password: hashedPassword,
    })

    // Return success without password
    const { password: _, ...userWithoutPassword } = user
    return new Response(
      JSON.stringify({ 
        message: 'User created successfully',
        user: userWithoutPassword
      }),
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return new Response(
      JSON.stringify({ error: 'Error creating user' }),
      { status: 500 }
    )
  }
} 