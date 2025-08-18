import { type NextRequest, NextResponse } from "next/server"

const JWT_SECRET = "your-secret-key-here"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Registration API called")

    const userData = await request.json()
    console.log("[v0] Received user data:", { ...userData, password: "[REDACTED]" })

    const { username, email, password, fullName, employeeId, department, role } = userData

    // Basic validation
    if (!username || !email || !password || !fullName) {
      console.log("[v0] Missing required fields")
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Check password strength
    if (password.length < 6) {
      console.log("[v0] Password too short")
      return NextResponse.json({ message: "Password must be at least 6 characters long" }, { status: 400 })
    }

    // For demo purposes, create a new user object
    const newUser = {
      id: Date.now(),
      username,
      email,
      employeeId: employeeId || `EMP${Date.now()}`,
      department: department || "General",
      role: role || "EMPLOYEE",
      status: "ACTIVE" as const,
      fullName,
    }

    console.log("[v0] Created new user:", { ...newUser })

    const accessToken = `access_${Date.now()}_${newUser.id}`
    const refreshToken = `refresh_${Date.now()}_${newUser.id}`

    console.log("[v0] Generated tokens successfully")

    const response = {
      accessToken,
      refreshToken,
      user: newUser,
    }

    console.log("[v0] Sending response")
    return NextResponse.json(response)
  } catch (error) {
    console.error("[v0] Registration API error:", error)
    console.error("[v0] Error stack:", error instanceof Error ? error.stack : "No stack trace")

    return NextResponse.json(
      { message: "Internal server error", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
