import { type NextRequest, NextResponse } from "next/server"

// Mock departments data
const mockDepartments = [
  {
    id: 1,
    name: "Engineering",
    description: "Software development and technical operations",
    code: "ENG",
    location: "Building A, Floor 3",
    costCenter: "CC-001",
    status: "ACTIVE" as const,
    employeeCount: 25,
  },
  {
    id: 2,
    name: "Human Resources",
    description: "Employee relations and talent management",
    code: "HR",
    location: "Building B, Floor 1",
    costCenter: "CC-002",
    status: "ACTIVE" as const,
    employeeCount: 8,
  },
  {
    id: 3,
    name: "Sales",
    description: "Sales and business development",
    code: "SALES",
    location: "Building A, Floor 2",
    costCenter: "CC-003",
    status: "ACTIVE" as const,
    employeeCount: 15,
  },
  {
    id: 4,
    name: "Marketing",
    description: "Marketing and brand management",
    code: "MKT",
    location: "Building B, Floor 2",
    costCenter: "CC-004",
    status: "ACTIVE" as const,
    employeeCount: 12,
  },
  {
    id: 5,
    name: "Finance",
    description: "Financial planning and accounting",
    code: "FIN",
    location: "Building A, Floor 1",
    costCenter: "CC-005",
    status: "ACTIVE" as const,
    employeeCount: 10,
  },
  {
    id: 6,
    name: "Operations",
    description: "Business operations and logistics",
    code: "OPS",
    location: "Building C, Floor 1",
    costCenter: "CC-006",
    status: "ACTIVE" as const,
    employeeCount: 18,
  },
]

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] Departments API called")

    // Check for authorization header
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Authorization required" }, { status: 401 })
    }

    console.log("[v0] Returning departments:", mockDepartments.length)

    return NextResponse.json(mockDepartments)
  } catch (error) {
    console.error("[v0] Departments API error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Create department API called")

    // Check for authorization header
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Authorization required" }, { status: 401 })
    }

    const departmentData = await request.json()
    console.log("[v0] Received department data:", departmentData)

    // Create new department with generated ID
    const newDepartment = {
      id: Date.now(), // Simple ID generation
      ...departmentData,
      status: departmentData.status || "ACTIVE",
      employeeCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    console.log("[v0] Created new department:", newDepartment)

    return NextResponse.json(newDepartment, { status: 201 })
  } catch (error) {
    console.error("[v0] Create department error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
