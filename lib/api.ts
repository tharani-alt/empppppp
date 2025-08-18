const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

interface ApiResponse<T> {
  data: T
  message?: string
}

interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
}

export interface Employee {
  id?: number
  employeeId: string
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  departmentId?: number
  departmentName?: string
  designationId?: number
  designationTitle?: string
  employmentType?: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN"
  previousEmployer?: string
  dateOfJoining?: string
  dateOfBirth?: string
  address?: string
  status?: "ACTIVE" | "INACTIVE" | "TERMINATED" | "ON_LEAVE"
  managerId?: number
  managerName?: string
  createdAt?: string
  updatedAt?: string
}

export interface Department {
  id?: number
  name: string
  description?: string
  code: string
  managerId?: number
  managerName?: string
  parentDepartmentId?: number
  parentDepartmentName?: string
  location?: string
  costCenter?: string
  status?: "ACTIVE" | "INACTIVE" | "RESTRUCTURING"
  employeeCount?: number
  createdAt?: string
  updatedAt?: string
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("token")
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "An error occurred" }))
      throw new Error(error.message || `HTTP error! status: ${response.status}`)
    }
    return response.json()
  }

  // Employee API methods
  async getEmployees(params?: {
    page?: number
    size?: number
    sortBy?: string
    sortDir?: string
  }): Promise<PaginatedResponse<Employee>> {
    const searchParams = new URLSearchParams()
    if (params?.page !== undefined) searchParams.append("page", params.page.toString())
    if (params?.size !== undefined) searchParams.append("size", params.size.toString())
    if (params?.sortBy) searchParams.append("sortBy", params.sortBy)
    if (params?.sortDir) searchParams.append("sortDir", params.sortDir)

    const response = await fetch(`${API_BASE_URL}/employees?${searchParams}`, {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse<PaginatedResponse<Employee>>(response)
  }

  async getEmployee(id: number): Promise<Employee> {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse<Employee>(response)
  }

  async createEmployee(employee: Omit<Employee, "id">): Promise<Employee> {
    const response = await fetch(`${API_BASE_URL}/employees`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(employee),
    })
    return this.handleResponse<Employee>(response)
  }

  async updateEmployee(id: number, employee: Partial<Employee>): Promise<Employee> {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(employee),
    })
    return this.handleResponse<Employee>(response)
  }

  async deleteEmployee(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "An error occurred" }))
      throw new Error(error.message || `HTTP error! status: ${response.status}`)
    }
  }

  async searchEmployees(
    query: string,
    params?: { page?: number; size?: number },
  ): Promise<PaginatedResponse<Employee>> {
    const searchParams = new URLSearchParams()
    searchParams.append("q", query)
    if (params?.page !== undefined) searchParams.append("page", params.page.toString())
    if (params?.size !== undefined) searchParams.append("size", params.size.toString())

    const response = await fetch(`${API_BASE_URL}/employees/search?${searchParams}`, {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse<PaginatedResponse<Employee>>(response)
  }

  // Department API methods
  async getDepartments(): Promise<Department[]> {
    console.log("[v0] Calling getDepartments API")
    const headers = this.getAuthHeaders()
    console.log("[v0] Auth headers:", headers)

    const response = await fetch(`${API_BASE_URL}/departments`, {
      headers,
    })

    console.log("[v0] Departments API response status:", response.status)
    return this.handleResponse<Department[]>(response)
  }

  async getDepartment(id: number): Promise<Department> {
    const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse<Department>(response)
  }

  async createDepartment(department: Omit<Department, "id">): Promise<Department> {
    const response = await fetch(`${API_BASE_URL}/departments`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(department),
    })
    return this.handleResponse<Department>(response)
  }
}

export const apiService = new ApiService()
