'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface AdminContextType {
  isAdmin: boolean
  isLoading: boolean
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          setIsAdmin(false)
          setIsLoading(false)
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
        } else {
          setIsAdmin(userData.role === 'admin')
        }
      } catch (error) {
        console.error('Error in admin check:', error)
        setIsAdmin(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAdminStatus()
  }, [supabase])

  const value = useMemo(() => ({
    isAdmin,
    isLoading,
  }), [isAdmin, isLoading])

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
} 