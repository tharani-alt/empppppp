"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/layout/protected-route"
import { Navbar } from "@/components/layout/navbar"
import { EmployeeList } from "@/components/employees/employee-list"
import { EmployeeForm } from "@/components/employees/employee-form"
import { EmployeeDetail } from "@/components/employees/employee-detail"
import type { Employee } from "@/lib/api"

type ViewMode = "list" | "create" | "edit" | "detail"

export default function EmployeesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

  const handleEmployeeSelect = (employee: Employee) => {
    setSelectedEmployee(employee)
    setViewMode("detail")
  }

  const handleEmployeeEdit = (employee: Employee) => {
    setSelectedEmployee(employee)
    setViewMode("edit")
  }

  const handleEmployeeCreate = () => {
    setSelectedEmployee(null)
    setViewMode("create")
  }

  const handleFormSave = (employee: Employee) => {
    setSelectedEmployee(employee)
    setViewMode("detail")
  }

  const handleFormCancel = () => {
    setSelectedEmployee(null)
    setViewMode("list")
  }

  const handleDetailClose = () => {
    setSelectedEmployee(null)
    setViewMode("list")
  }

  const handleDetailEdit = (employee: Employee) => {
    setSelectedEmployee(employee)
    setViewMode("edit")
  }

  return (
    <ProtectedRoute requiredRoles={["HR_STAFF", "HR_MANAGER", "DEPARTMENT_MANAGER", "SYSTEM_ADMIN"]}>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          {viewMode === "list" && (
            <EmployeeList
              onEmployeeSelect={handleEmployeeSelect}
              onEmployeeEdit={handleEmployeeEdit}
              onEmployeeCreate={handleEmployeeCreate}
            />
          )}

          {(viewMode === "create" || viewMode === "edit") && (
            <EmployeeForm
              employee={selectedEmployee || undefined}
              onSave={handleFormSave}
              onCancel={handleFormCancel}
            />
          )}

          {viewMode === "detail" && selectedEmployee && (
            <EmployeeDetail employee={selectedEmployee} onEdit={handleDetailEdit} onClose={handleDetailClose} />
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
