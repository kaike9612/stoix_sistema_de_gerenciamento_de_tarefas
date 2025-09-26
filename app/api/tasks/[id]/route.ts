import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"
import { AuthService } from "@/lib/auth"
import type { ApiResponse, Task } from "@/lib/types"

interface RouteParams {
  params: { id: string }
}

// GET /api/tasks/[id] - Get specific task
export async function GET(request: NextRequest, { params }: RouteParams): Promise<NextResponse<ApiResponse<Task>>> {
  try {
    // Check authentication
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token || !AuthService.validateSessionToken(token)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const user = AuthService.getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 401 })
    }

    const task = Database.getTaskById(params.id)

    if (!task) {
      return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 })
    }

    // Check if task belongs to user
    if (task.userId !== user.id) {
      return NextResponse.json({ success: false, error: "Access denied" }, { status: 403 })
    }

    return NextResponse.json({
      success: true,
      data: task,
      message: "Task retrieved successfully",
    })
  } catch (error) {
    console.error("Error fetching task:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/tasks/[id] - Update task
export async function PUT(request: NextRequest, { params }: RouteParams): Promise<NextResponse<ApiResponse<Task>>> {
  try {
    // Check authentication
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token || !AuthService.validateSessionToken(token)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    // Validate CSRF token
    const csrfToken = request.headers.get("x-csrf-token")
    if (!csrfToken || !AuthService.validateCSRFToken(csrfToken)) {
      return NextResponse.json({ success: false, error: "Invalid CSRF token" }, { status: 403 })
    }

    const user = AuthService.getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 401 })
    }

    const existingTask = Database.getTaskById(params.id)

    if (!existingTask) {
      return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 })
    }

    // Check if task belongs to user
    if (existingTask.userId !== user.id) {
      return NextResponse.json({ success: false, error: "Access denied" }, { status: 403 })
    }

    const body = await request.json()
    const { title, description, status, priority } = body

    // Validate enum values if provided
    if (status && !["pending", "in-progress", "completed"].includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid status value" }, { status: 400 })
    }

    if (priority && !["low", "medium", "high"].includes(priority)) {
      return NextResponse.json({ success: false, error: "Invalid priority value" }, { status: 400 })
    }

    const updatedTask = Database.updateTask(params.id, {
      title,
      description,
      status,
      priority,
    })

    if (!updatedTask) {
      return NextResponse.json({ success: false, error: "Failed to update task" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: updatedTask,
      message: "Task updated successfully",
    })
  } catch (error) {
    console.error("Error updating task:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/tasks/[id] - Delete task
export async function DELETE(request: NextRequest, { params }: RouteParams): Promise<NextResponse<ApiResponse<null>>> {
  try {
    // Check authentication
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token || !AuthService.validateSessionToken(token)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    // Validate CSRF token
    const csrfToken = request.headers.get("x-csrf-token")
    if (!csrfToken || !AuthService.validateCSRFToken(csrfToken)) {
      return NextResponse.json({ success: false, error: "Invalid CSRF token" }, { status: 403 })
    }

    const user = AuthService.getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 401 })
    }

    const existingTask = Database.getTaskById(params.id)

    if (!existingTask) {
      return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 })
    }

    // Check if task belongs to user
    if (existingTask.userId !== user.id) {
      return NextResponse.json({ success: false, error: "Access denied" }, { status: 403 })
    }

    const deleted = Database.deleteTask(params.id)

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Failed to delete task" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: null,
      message: "Task deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting task:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
