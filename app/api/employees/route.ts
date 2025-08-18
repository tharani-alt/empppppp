import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = "your-secret-key-here"

const mockEmployees = [
  {
    id: 1,
    employeeId: "EMP001",
    firstName: "System",
    lastName: "Administrator",
    email: "admin@company.com",
    phone: "+1-555-0101",
    departmentId: 1,
    departmentName: "Engineering",
    designationId: 1,
    designationTitle: "System Administrator",
    joiningDate: "2020-01-15",
    salary: 75000,
    status: "ACTIVE",
    employmentType: "FULL_TIME",
    address: "123 Main St, City, State 12345",
    emergencyContact: "Jane Doe - +1-555-0102",
    createdAt: "2020-01-15T00:00:00Z",
    updatedAt: "2020-01-15T00:00:00Z",
  },
  {
    id: 2,
    employeeId: "EMP002",
    firstName: "HR",
    lastName: "Manager",
    email: "hr@company.com",
    phone: "+1-555-0201",
    departmentId: 2,
    departmentName: "Human Resources",
    designationId: 2,
    designationTitle: "HR Manager",
    joiningDate: "2019-03-20",
    salary: 65000,
    status: "ACTIVE",
    employmentType: "FULL_TIME",
    address: "456 Oak Ave, City, State 12345",
    emergencyContact: "John Smith - +1-555-0202",
    createdAt: "2019-03-20T00:00:00Z",
    updatedAt: "2019-03-20T00:00:00Z",
  },
  {
    id: 3,
    employeeId: "EMP003",
    firstName: "John",
    lastName: "Employee",
    email: "employee@company.com",
    phone: "+1-555-0301",
    departmentId: 1,
    departmentName: "Engineering",
    designationId: 3,
    designationTitle: "Software Developer",
    joiningDate: "2021-06-10",
    salary: 55000,
    status: "ACTIVE",
    employmentType: "FULL_TIME",
    address: "789 Pine St, City, State 12345",
    emergencyContact: "Mary Johnson - +1-555-0302",
    createdAt: "2021-06-10T00:00:00Z",
    updatedAt: "2021-06-10T00:00:00Z",
  },
  {
    id: 4,
    employeeId: "EMP004",
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice@company.com",
    phone: "+1-555-0401",
    departmentId: 3,
    departmentName: "Sales",
    designationId: 4,
    designationTitle: "Sales Representative",
    joiningDate: "2022-02-14",
    salary: 45000,
    status: "ACTIVE",
    employmentType: "FULL_TIME",
    address: "321 Elm St, City, State 12345",
    emergencyContact: "Bob Johnson - +1-555-0402",
    createdAt: "2022-02-14T00:00:00Z",
    updatedAt: "2022-02-14T00:00:00Z",
  },
  {
    id: 5,
    employeeId: "EMP005",
    firstName: "Bob",
    lastName: "Wilson",
    email: "bob@company.com",
    phone: "+1-555-0501",
    departmentId: 4,
    departmentName: "Marketing",
    designationId: 5,
    designationTitle: "Marketing Specialist",
    joiningDate: "2021-11-08",
    salary: 50000,
    status: "ON_LEAVE",
    employmentType: "PART_TIME",
    address: "654 Maple Ave, City, State 12345",
    emergencyContact: "Carol Wilson - +1-555-0502",
    createdAt: "2021-11-08T00:00:00Z",
    updatedAt: "2021-11-08T00:00:00Z",
  },
]

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

export async function GET(request: NextRequest) {
  const user = verifyToken(request)
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "0")
  const size = Number.parseInt(searchParams.get("size") || "10")
  const search = searchParams.get("search") || ""
  const department = searchParams.get("department") || ""
  const sortBy = searchParams.get("sortBy") || "firstName"
  const sortDir = searchParams.get("sortDir") || "asc"

  let filteredEmployees = [...mockEmployees]

  // Apply search filter
  if (search) {
    filteredEmployees = filteredEmployees.filter(
      (emp) =>
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase()) ||
        emp.departmentName.toLowerCase().includes(search.toLowerCase()),
    )
  }

  // Apply department filter
  if (department) {
    filteredEmployees = filteredEmployees.filter((emp) => emp.departmentName.toLowerCase() === department.toLowerCase())
  }

  filteredEmployees.sort((a, b) => {
    let aValue: any = a[sortBy as keyof typeof a]
    let bValue: any = b[sortBy as keyof typeof b]

    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }

    if (sortDir === "desc") {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    } else {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    }
  })

  // Apply pagination
  const startIndex = page * size
  const endIndex = startIndex + size
  const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex)

  return NextResponse.json({
    content: paginatedEmployees,
    totalElements: filteredEmployees.length,
    totalPages: Math.ceil(filteredEmployees.length / size),
    size,
    number: page,
  })
}

export async function DELETE(request: NextRequest) {
  const user = verifyToken(request)
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const employeeId = searchParams.get("id")

  if (!employeeId) {
    return NextResponse.json({ message: "Employee ID is required" }, { status: 400 })
  }

  // In a real application, you would delete from the database
  // For now, we'll just return success
  return NextResponse.json({ message: "Employee deleted successfully" })
}
