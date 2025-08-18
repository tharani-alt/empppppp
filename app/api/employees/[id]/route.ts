import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = "your-secret-key-here"

function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  const token = authHeader.substring(7)
  try {
    return jwt.verify(token, JWT_SECRET) as any
  } catch {
    return null
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const user = verifyToken(request)
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const employeeId = params.id

  if (!employeeId) {
    return NextResponse.json({ message: "Employee ID is required" }, { status: 400 })
  }

  // In a real application, you would delete from the database
  // For now, we'll just return success
  return NextResponse.json({ message: "Employee deleted successfully" })
}
