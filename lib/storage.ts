// Local storage utilities for task management
export class LocalStorage {
  private static prefix = "task-management-"

  static get<T>(key: string): T | null {
    if (typeof window === "undefined") return null

    try {
      const item = localStorage.getItem(this.prefix + key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  }

  static set<T>(key: string, value: T): void {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value))
    } catch (error) {
      console.error("Failed to save to localStorage:", error)
    }
  }

  static remove(key: string): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(this.prefix + key)
  }

  static clear(): void {
    if (typeof window === "undefined") return

    const keys = Object.keys(localStorage)
    keys.forEach((key) => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key)
      }
    })
  }
}
