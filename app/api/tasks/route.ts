import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"
import { AuthService } from "@/lib/auth"
import type { ApiResponse, Task } from "@/lib/types"

// GET /api/tasks - List all tasks for authenticated user
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<Task[]>>> {
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

    const tasks = Database.getTasks(user.id)

    return NextResponse.json({
      success: true,
      data: tasks,
      message: "Tasks retrieved successfully",
    })
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/tasks - Create new task
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Task>>> {
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

    const body = await request.json()
    const { title, description, status = "pending", priority = "medium" } = body

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json({ success: false, error: "Title and description are required" }, { status: 400 })
    }

    // Validate enum values
    if (!["pending", "in-progress", "completed"].includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid status value" }, { status: 400 })
    }

    if (!["low", "medium", "high"].includes(priority)) {
      return NextResponse.json({ success: false, error: "Invalid priority value" }, { status: 400 })
    }

    const newTask = Database.createTask({
      title,
      description,
      status,
      priority,
      userId: user.id,
    })

    return NextResponse.json(
      {
        success: true,
        data: newTask,
        message: "Task created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
