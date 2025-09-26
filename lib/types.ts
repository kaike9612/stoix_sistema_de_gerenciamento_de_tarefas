export interface Task {
  id: string
  title: string
  description: string
  status: "pending" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  createdAt: string
  updatedAt: string
  userId: string
}

export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export interface AuthSession {
  user: User
  token: string
  csrfToken: string
  expiresAt: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
