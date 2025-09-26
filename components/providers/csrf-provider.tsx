"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useAuth } from "@/hooks/use-auth"

interface CSRFContextType {
  csrfToken: string | null
  refreshCSRFToken: () => Promise<void>
}

const CSRFContext = createContext<CSRFContextType | undefined>(undefined)

export function CSRFProvider({ children }: { children: ReactNode }) {
  const [csrfToken, setCSRFToken] = useState<string | null>(null)
  const { isAuthenticated, session } = useAuth()

  const refreshCSRFToken = async () => {
    if (!isAuthenticated) {
      setCSRFToken(null)
      return
    }

    try {
      const response = await fetch("/api/csrf", {
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data?.csrfToken) {
          setCSRFToken(data.data.csrfToken)
        }
      }
    } catch (error) {
      console.error("Failed to refresh CSRF token:", error)
    }
  }

  // Refresh CSRF token when authentication status changes
  useEffect(() => {
    if (isAuthenticated) {
      // Use the CSRF token from the session if available
      if (session?.csrfToken) {
        setCSRFToken(session.csrfToken)
      } else {
        refreshCSRFToken()
      }
    } else {
      setCSRFToken(null)
    }
  }, [isAuthenticated, session])

  // Refresh CSRF token periodically (every 30 minutes)
  useEffect(() => {
    if (!isAuthenticated) return

    const interval = setInterval(
      () => {
        refreshCSRFToken()
      },
      30 * 60 * 1000,
    ) // 30 minutes

    return () => clearInterval(interval)
  }, [isAuthenticated])

  return <CSRFContext.Provider value={{ csrfToken, refreshCSRFToken }}>{children}</CSRFContext.Provider>
}

export function useCSRF() {
  const context = useContext(CSRFContext)
  if (context === undefined) {
    throw new Error("useCSRF must be used within a CSRFProvider")
  }
  return context
}
