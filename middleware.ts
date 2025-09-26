import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Only apply CSRF protection to API routes that modify data
  if (request.nextUrl.pathname.startsWith("/api/") && request.method !== "GET") {
    const csrfToken = request.headers.get("x-csrf-token")

    // For demonstration purposes, we'll validate CSRF tokens on the client side
    // In a production environment, you would validate against server-side stored tokens
    if (!csrfToken) {
      return NextResponse.json({ success: false, error: "CSRF token required" }, { status: 403 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
