"use client"

import { useState, useEffect, useCallback } from "react"
import type { Task } from "@/lib/types"
import { apiClient } from "@/lib/api-client"
import { useAuth } from "./use-auth"

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated } = useAuth()

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated) {
      setTasks([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.getTasks()

      if (response.success && response.data) {
        setTasks(response.data)
      } else {
        setError(response.error || "Failed to fetch tasks")
      }
    } catch (err) {
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  // Create task
  const createTask = useCallback(
    async (taskData: {
      title: string
      description: string
      status?: "pending" | "in-progress" | "completed"
      priority?: "low" | "medium" | "high"
    }) => {
      try {
        const response = await apiClient.createTask(taskData)

        if (response.success && response.data) {
          setTasks((prev) => [...prev, response.data!])
          return { success: true, data: response.data }
        } else {
          return { success: false, error: response.error || "Failed to create task" }
        }
      } catch (err) {
        return { success: false, error: "Network error occurred" }
      }
    },
    [],
  )

  // Update task
  const updateTask = useCallback(
    async (
      id: string,
      updates: Partial<{
        title: string
        description: string
        status: "pending" | "in-progress" | "completed"
        priority: "low" | "medium" | "high"
      }>,
    ) => {
      try {
        const response = await apiClient.updateTask(id, updates)

        if (response.success && response.data) {
          setTasks((prev) => prev.map((task) => (task.id === id ? response.data! : task)))
          return { success: true, data: response.data }
        } else {
          return { success: false, error: response.error || "Failed to update task" }
        }
      } catch (err) {
        return { success: false, error: "Network error occurred" }
      }
    },
    [],
  )

  // Delete task
  const deleteTask = useCallback(async (id: string) => {
    try {
      const response = await apiClient.deleteTask(id)

      if (response.success) {
        setTasks((prev) => prev.filter((task) => task.id !== id))
        return { success: true }
      } else {
        return { success: false, error: response.error || "Failed to delete task" }
      }
    } catch (err) {
      return { success: false, error: "Network error occurred" }
    }
  }, [])

  // Load tasks on mount and when authentication changes
  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  }
}
