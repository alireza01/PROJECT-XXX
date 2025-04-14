"use client"

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

export function useAdmin() {
  const router = useRouter()

  const logout = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })

      if (response.ok) {
        router.push('/login')
      }
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }, [router])

  return {
    logout,
  }
} 