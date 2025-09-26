import type { ApiResponse, Task } from "./types"
import { AuthService } from "./auth"

class ApiClient {
  private baseUrl = "/api"

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const session = AuthService.getCurrentSession()

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    // Add authorization header if user is authenticated
    if (session?.token) {
      headers["Authorization"] = `Bearer ${session.token}`
    }

    // Add CSRF token for non-GET requests
    if (options.method && options.method !== "GET" && session?.csrfToken) {
      // Validate CSRF token before using it
      if (AuthService.validateCSRFToken(session.csrfToken)) {
        headers["X-CSRF-Token"] = session.csrfToken
      } else {
        // Refresh session if CSRF token is invalid
        const refreshedSession = AuthService.refreshSession()
        if (refreshedSession?.csrfToken) {
          headers["X-CSRF-Token"] = refreshedSession.csrfToken
        }
      }
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      })

      const data = await response.json()

      // Handle authentication errors
      if (response.status === 401) {
        AuthService.logout()
        window.location.href = "/"
      }

      if (response.status === 403 && data.error?.includes("CSRF")) {
        // Try to refresh the session and retry the request once
        const refreshedSession = AuthService.refreshSession()
        if (refreshedSession?.csrfToken && options.method !== "GET") {
          const retryHeaders = { ...headers, "X-CSRF-Token": refreshedSession.csrfToken }
          const retryResponse = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers: retryHeaders,
          })
          return await retryResponse.json()
        }
      }

      return data
    } catch (error) {
      console.error("API request failed:", error)
      return {
        success: false,
        error: "Network error occurred",
      }
    }
  }

  // Task API methods
  async getTasks(): Promise<ApiResponse<Task[]>> {
    return this.request<Task[]>("/tasks")
  }

  async getTask(id: string): Promise<ApiResponse<Task>> {
    return this.request<Task>(`/tasks/${id}`)
  }

  async createTask(taskData: {
    title: string
    description: string
    status?: "pending" | "in-progress" | "completed"
    priority?: "low" | "medium" | "high"
  }): Promise<ApiResponse<Task>> {
    return this.request<Task>("/tasks", {
      method: "POST",
      body: JSON.stringify(taskData),
    })
  }

  async updateTask(
    id: string,
    updates: Partial<{
      title: string
      description: string
      status: "pending" | "in-progress" | "completed"
      priority: "low" | "medium" | "high"
    }>,
  ): Promise<ApiResponse<Task>> {
    return this.request<Task>(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    })
  }

  async deleteTask(id: string): Promise<ApiResponse<null>> {
    return this.request<null>(`/tasks/${id}`, {
      method: "DELETE",
    })
  }
}

export const apiClient = new ApiClient()
