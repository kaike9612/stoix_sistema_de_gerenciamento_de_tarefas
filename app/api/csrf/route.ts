import { NextResponse } from "next/server"
import { AuthService } from "@/lib/auth"
import type { ApiResponse } from "@/lib/types"

// GET /api/csrf - Get CSRF token for authenticated users
export async function GET(): Promise<NextResponse<ApiResponse<{ csrfToken: string }>>> {
  try {
    const session = AuthService.getCurrentSession()

    if (!session) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 })
    }

    // Generate a new CSRF token
    const csrfToken = AuthService.generateCSRFToken()

    return NextResponse.json({
      success: true,
      data: { csrfToken },
      message: "CSRF token generated successfully",
    })
  } catch (error) {
    console.error("Error generating CSRF token:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
