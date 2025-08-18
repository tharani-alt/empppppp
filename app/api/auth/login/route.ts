import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

// Mock users database
const mockUsers = [
  {
    id: 1,
    username: "admin",
    email: "admin@company.com",
    password: "admin123", // In real app, this would be hashed
    employeeId: "EMP001",
    department: "IT",
    role: "SYSTEM_ADMIN",
    status: "ACTIVE",
    fullName: "System Administrator",
  },
  {
    id: 2,
    username: "hr_manager",
    email: "hr@company.com",
    password: "hr123",
    employeeId: "EMP002",
    department: "Human Resources",
    role: "HR_MANAGER",
    status: "ACTIVE",
    fullName: "HR Manager",
  },
  {
    id: 3,
    username: "employee",
    email: "employee@company.com",
    password: "emp123",
    employeeId: "EMP003",
    department: "Engineering",
    role: "EMPLOYEE",
    status: "ACTIVE",
    fullName: "John Employee",
  },
]

const JWT_SECRET = "your-secret-key-here"

export async function POST(request: NextRequest) {
  try {
    const { identifier, password } = await request.json()

    // Find user by username, email, or employeeId
    const user = mockUsers.find(
      (u) => u.username === identifier || u.email === identifier || u.employeeId === identifier,
    )

    if (!user || user.password !== password) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    if (user.status !== "ACTIVE") {
      return NextResponse.json({ message: "Account is not active" }, { status: 403 })
    }

    // Generate JWT tokens
    const accessToken = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "1h" },
    )

    const refreshToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" })

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      accessToken,
      refreshToken,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
