"use client"

import { useState, useEffect } from "react"
import { apiService, type Employee } from "@/lib/api"
import { PermissionGuard } from "@/components/auth/permission-guard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, Users } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { PERMISSIONS } from "@/lib/permissions"

interface EmployeeListProps {
  onEmployeeSelect?: (employee: Employee) => void
  onEmployeeEdit?: (employee: Employee) => void
  onEmployeeCreate?: () => void
}

export function EmployeeList({ onEmployeeSelect, onEmployeeEdit, onEmployeeCreate }: EmployeeListProps) {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [sortBy, setSortBy] = useState("firstName")
  const [sortDir, setSortDir] = useState("asc")
  const { user } = useAuth()

  const canManageEmployees = user?.role === "HR_STAFF" || user?.role === "HR_MANAGER" || user?.role === "SYSTEM_ADMIN"
  const canDeleteEmployees = user?.role === "HR_MANAGER" || user?.role === "SYSTEM_ADMIN"

  useEffect(() => {
    loadEmployees()
  }, [currentPage, pageSize, sortBy, sortDir])

  const loadEmployees = async () => {
    try {
      setLoading(true)
      setError("")

      let response
      if (searchTerm.trim()) {
        response = await apiService.searchEmployees(searchTerm, {
          page: currentPage,
          size: pageSize,
        })
      } else {
        response = await apiService.getEmployees({
          page: currentPage,
          size: pageSize,
          sortBy,
          sortDir,
        })
      }

      setEmployees(response.content)
      setTotalPages(response.totalPages)
      setTotalElements(response.totalElements)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load employees")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setCurrentPage(0)
    loadEmployees()
  }

  const handleDelete = async (employee: Employee) => {
    if (!employee.id) return

    if (window.confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
      try {
        await apiService.deleteEmployee(employee.id)
        loadEmployees()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete employee")
      }
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "INACTIVE":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      case "ON_LEAVE":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "TERMINATED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getEmploymentTypeColor = (type?: string) => {
    switch (type) {
      case "FULL_TIME":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "PART_TIME":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "CONTRACT":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "INTERN":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6" />
            Employees
          </h2>
          <p className="text-muted-foreground">{totalElements} total employees</p>
        </div>
        <PermissionGuard permission={PERMISSIONS.EMPLOYEE_WRITE}>
          <Button onClick={onEmployeeCreate} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Employee
          </Button>
        </PermissionGuard>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch} variant="outline">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="firstName">First Name</SelectItem>
                  <SelectItem value="lastName">Last Name</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="employeeId">Employee ID</SelectItem>
                  <SelectItem value="createdAt">Date Created</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortDir} onValueChange={setSortDir}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>

              <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Employee Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Employment Type</TableHead>
                <TableHead>Status</TableHead>
                <PermissionGuard permission={PERMISSIONS.EMPLOYEE_WRITE}>
                  <TableHead className="text-right">Actions</TableHead>
                </PermissionGuard>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading employees...
                  </TableCell>
                </TableRow>
              ) : employees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No employees found
                  </TableCell>
                </TableRow>
              ) : (
                employees.map((employee) => (
                  <TableRow
                    key={employee.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onEmployeeSelect?.(employee)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {getInitials(employee.firstName, employee.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {employee.firstName} {employee.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">{employee.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{employee.employeeId}</TableCell>
                    <TableCell>{employee.departmentName || "—"}</TableCell>
                    <TableCell>{employee.designationTitle || "—"}</TableCell>
                    <TableCell>
                      {employee.employmentType && (
                        <Badge variant="outline" className={getEmploymentTypeColor(employee.employmentType)}>
                          {employee.employmentType.replace("_", " ")}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(employee.status)}>
                        {employee.status || "ACTIVE"}
                      </Badge>
                    </TableCell>
                    <PermissionGuard permission={PERMISSIONS.EMPLOYEE_WRITE}>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              onEmployeeEdit?.(employee)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <PermissionGuard permission={PERMISSIONS.EMPLOYEE_DELETE}>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(employee)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </PermissionGuard>
                        </div>
                      </TableCell>
                    </PermissionGuard>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of{" "}
            {totalElements} employees
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage + 1} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
