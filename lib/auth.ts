import type { User, AuthSession } from "./types"
import { Database } from "./database"
import { LocalStorage } from "./storage"

export class AuthService {
  private static SESSION_KEY = "auth-session"
  private static CSRF_TOKENS_KEY = "csrf-tokens"

  // Generate CSRF token
  static generateCSRFToken(): string {
    const token = btoa(Date.now().toString() + Math.random().toString()).replace(/[^a-zA-Z0-9]/g, "")

    // Store CSRF token with expiration
    const csrfTokens = LocalStorage.get<Record<string, number>>(this.CSRF_TOKENS_KEY) || {}
    csrfTokens[token] = Date.now() + 60 * 60 * 1000 // 1 hour expiration
    LocalStorage.set(this.CSRF_TOKENS_KEY, csrfTokens)

    return token
  }

  // Validate CSRF token
  static validateCSRFToken(token: string): boolean {
    const csrfTokens = LocalStorage.get<Record<string, number>>(this.CSRF_TOKENS_KEY) || {}
    const tokenExpiration = csrfTokens[token]

    if (!tokenExpiration || Date.now() > tokenExpiration) {
      // Remove expired token
      delete csrfTokens[token]
      LocalStorage.set(this.CSRF_TOKENS_KEY, csrfTokens)
      return false
    }

    return true
  }

  // Clean expired CSRF tokens
  static cleanExpiredCSRFTokens(): void {
    const csrfTokens = LocalStorage.get<Record<string, number>>(this.CSRF_TOKENS_KEY) || {}
    const now = Date.now()

    Object.keys(csrfTokens).forEach((token) => {
      if (csrfTokens[token] < now) {
        delete csrfTokens[token]
      }
    })

    LocalStorage.set(this.CSRF_TOKENS_KEY, csrfTokens)
  }

  static async login(email: string, password: string): Promise<AuthSession | null> {
    try {
      // Initialize sample data if not exists
      const users = Database.getUsers()
      if (users.length === 0) {
        Database.initializeSampleData()
      }

      // For demo purposes, accept any password for existing users
      // In production, implement proper password verification with bcrypt
      let user = Database.getUserByEmail(email)

      if (!user) {
        // Create new user for demo if email doesn't exist
        user = Database.createUser({
          email,
          name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
        })
      }

      const session: AuthSession = {
        user,
        token: this.generateSessionToken(),
        csrfToken: this.generateCSRFToken(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      }

      LocalStorage.set(this.SESSION_KEY, session)

      // Clean expired CSRF tokens
      this.cleanExpiredCSRFTokens()

      return session
    } catch (error) {
      console.error("Login error:", error)
      return null
    }
  }

  // Logout user
  static logout(): void {
    const session = this.getCurrentSession()
    if (session) {
      // Remove CSRF token
      const csrfTokens = LocalStorage.get<Record<string, number>>(this.CSRF_TOKENS_KEY) || {}
      delete csrfTokens[session.csrfToken]
      LocalStorage.set(this.CSRF_TOKENS_KEY, csrfTokens)
    }

    LocalStorage.remove(this.SESSION_KEY)
  }

  // Get current session
  static getCurrentSession(): AuthSession | null {
    const session = LocalStorage.get<AuthSession>(this.SESSION_KEY)

    if (!session) return null

    // Check if session is expired
    if (new Date(session.expiresAt) < new Date()) {
      this.logout()
      return null
    }

    return session
  }

  // Get current user
  static getCurrentUser(): User | null {
    const session = this.getCurrentSession()
    return session?.user || null
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return this.getCurrentSession() !== null
  }

  // Refresh session
  static refreshSession(): AuthSession | null {
    const currentSession = this.getCurrentSession()
    if (!currentSession) return null

    const newSession: AuthSession = {
      ...currentSession,
      csrfToken: this.generateCSRFToken(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    }

    LocalStorage.set(this.SESSION_KEY, newSession)
    return newSession
  }

  // Generate session token
  private static generateSessionToken(): string {
    return btoa(Date.now().toString() + Math.random().toString() + "session").replace(/[^a-zA-Z0-9]/g, "")
  }

  // Validate session token
  static validateSessionToken(token: string): boolean {
    const session = this.getCurrentSession()
    return session?.token === token
  }
}
