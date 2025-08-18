"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { apiService, type Employee, type Department } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Save, X } from "lucide-react"

interface EmployeeFormProps {
  employee?: Employee
  onSave?: (employee: Employee) => void
  onCancel?: () => void
}

export function EmployeeForm({ employee, onSave, onCancel }: EmployeeFormProps) {
  const [formData, setFormData] = useState<Partial<Employee>>({
    employeeId: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    departmentId: undefined,
    designationId: undefined,
    employmentType: "FULL_TIME",
    previousEmployer: "",
    dateOfJoining: "",
    dateOfBirth: "",
    address: "",
    status: "ACTIVE",
    managerId: undefined,
  })
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [loadingDepartments, setLoadingDepartments] = useState(true)

  const isEditing = !!employee?.id

  useEffect(() => {
    if (employee) {
      setFormData({
        ...employee,
        dateOfJoining: employee.dateOfJoining ? employee.dateOfJoining.split("T")[0] : "",
        dateOfBirth: employee.dateOfBirth ? employee.dateOfBirth.split("T")[0] : "",
      })
    }
  }, [employee])

  useEffect(() => {
    loadDepartments()
  }, [])

  const loadDepartments = async () => {
    try {
      console.log("[v0] Starting to load departments")
      const deps = await apiService.getDepartments()
      console.log("[v0] Successfully loaded departments:", deps)
      setDepartments(deps)
    } catch (err) {
      console.error("[v0] Failed to load departments:", err)
      setError(`Failed to load departments: ${err instanceof Error ? err.message : "Unknown error"}`)
    } finally {
      setLoadingDepartments(false)
    }
  }

  const handleChange = (field: keyof Employee, value: string | number | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = (): string | null => {
    if (!formData.employeeId?.trim()) return "Employee ID is required"
    if (!formData.firstName?.trim()) return "First name is required"
    if (!formData.lastName?.trim()) return "Last name is required"
    if (!formData.email?.trim()) return "Email is required"
    if (!formData.departmentId) return "Department is required"

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) return "Please enter a valid email address"

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      setLoading(true)

      const employeeData = {
        ...formData,
        departmentId: formData.departmentId ? Number(formData.departmentId) : undefined,
        designationId: formData.designationId ? Number(formData.designationId) : undefined,
        managerId: formData.managerId ? Number(formData.managerId) : undefined,
      } as Employee

      let savedEmployee: Employee
      if (isEditing && employee?.id) {
        savedEmployee = await apiService.updateEmployee(employee.id, employeeData)
      } else {
        savedEmployee = await apiService.createEmployee(employeeData)
      }

      onSave?.(savedEmployee)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save employee")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {isEditing ? "Edit Employee" : "Add New Employee"}
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID *</Label>
                <Input
                  id="employeeId"
                  value={formData.employeeId || ""}
                  onChange={(e) => handleChange("employeeId", e.target.value)}
                  placeholder="EMP001"
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status || "ACTIVE"}
                  onValueChange={(value) => handleChange("status", value as Employee["status"])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="ON_LEAVE">On Leave</SelectItem>
                    <SelectItem value="TERMINATED">Terminated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName || ""}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  placeholder="John"
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName || ""}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  placeholder="Doe"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="john.doe@company.com"
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber || ""}
                  onChange={(e) => handleChange("phoneNumber", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Employment Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Employment Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select
                  value={formData.departmentId?.toString() || ""}
                  onValueChange={(value) => handleChange("departmentId", value ? Number(value) : undefined)}
                  disabled={loadingDepartments}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id!.toString()}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="employmentType">Employment Type</Label>
                <Select
                  value={formData.employmentType || "FULL_TIME"}
                  onValueChange={(value) => handleChange("employmentType", value as Employee["employmentType"])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FULL_TIME">Full Time</SelectItem>
                    <SelectItem value="PART_TIME">Part Time</SelectItem>
                    <SelectItem value="CONTRACT">Contract</SelectItem>
                    <SelectItem value="INTERN">Intern</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfJoining">Date of Joining</Label>
                <Input
                  id="dateOfJoining"
                  type="date"
                  value={formData.dateOfJoining || ""}
                  onChange={(e) => handleChange("dateOfJoining", e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth || ""}
                  onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="previousEmployer">Previous Employer</Label>
              <Input
                id="previousEmployer"
                value={formData.previousEmployer || ""}
                onChange={(e) => handleChange("previousEmployer", e.target.value)}
                placeholder="Previous company name"
                disabled={loading}
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Additional Information</h3>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address || ""}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Full address"
                disabled={loading}
                rows={3}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isEditing ? "Update Employee" : "Create Employee"}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
