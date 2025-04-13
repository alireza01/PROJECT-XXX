import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          setIsAdmin(false)
          setIsLoading(false)
          router.push('/admin/login')
          return
        }

        const { data: userData, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single()

        if (error) {
          console.error('Error checking admin status:', error)
          setIsAdmin(false)
          router.push('/admin/login')
        } else {
          setIsAdmin(userData.role === 'admin')
          if (userData.role !== 'admin') {
            router.push('/admin/login')
          }
        }
      } catch (error) {
        console.error('Error in admin check:', error)
        setIsAdmin(false)
        router.push('/admin/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAdminStatus()
  }, [supabase, router])

  const validateToken = async (token: string) => {
    try {
      const { data, error } = await supabase
        .from('admin_tokens')
        .select('*')
        .eq('token', token)
        .single()

      if (error) throw error
      return data !== null
    } catch (error) {
      console.error('Error validating token:', error)
      return false
    }
  }

  return { isAdmin, isLoading, validateToken }
}

 