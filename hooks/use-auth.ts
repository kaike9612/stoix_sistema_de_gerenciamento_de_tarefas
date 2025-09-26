"use client"

import { useState, useEffect, useCallback } from "react"
import type { User, AuthSession } from "@/lib/types"
import { AuthService } from "@/lib/auth"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<AuthSession | null>(null)
  const [loading, setLoading] = useState(true)

  // Load session on mount
  useEffect(() => {
    const currentSession = AuthService.getCurrentSession()
    setSession(currentSession)
    setUser(currentSession?.user || null)
    setLoading(false)
  }, [])

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true)
      const newSession = await AuthService.login(email, password)

      if (newSession) {
        setSession(newSession)
        setUser(newSession.user)
        return { success: true }
      } else {
        return { success: false, error: "Invalid credentials" }
      }
    } catch (error) {
      return { success: false, error: "Login failed" }
    } finally {
      setLoading(false)
    }
  }, [])

  // Logout function
  const logout = useCallback(() => {
    AuthService.logout()
    setSession(null)
    setUser(null)
  }, [])

  // Refresh session
  const refreshSession = useCallback(() => {
    const newSession = AuthService.refreshSession()
    setSession(newSession)
    setUser(newSession?.user || null)
    return newSession
  }, [])

  // Get CSRF token
  const getCSRFToken = useCallback(() => {
    return session?.csrfToken || null
  }, [session])

  return {
    user,
    session,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshSession,
    getCSRFToken,
  }
}
