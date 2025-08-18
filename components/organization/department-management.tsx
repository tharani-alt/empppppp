"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Building2, Users, Plus, Edit, Trash2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface Department {
  id: number
  name: string
  description: string
  managerId?: number
  managerName?: string
  parentDepartmentId?: number
  parentDepartmentName?: string
  employeeCount: number
  budget?: number
  location?: string
  status: "ACTIVE" | "INACTIVE"
}

export function DepartmentManagement() {
  const { user } = useAuth()
  const [departments, setDepartments] = useState<Department[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    managerId: "",
    parentDepartmentId: "",
    budget: "",
    location: "",
    status: "ACTIVE" as const,
  })

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    try {
      // Mock departments data
      const mockDepartments: Department[] = [
        {
          id: 1,
          name: "Information Technology",
          description: "Manages all IT infrastructure and software development",
          managerId: 1,
          managerName: "System Administrator",
          employeeCount: 8,
          budget: 500000,
          location: "Building A, Floor 3",
          status: "ACTIVE",
        },
        {
          id: 2,
          name: "Human Resources",
          description: "Handles recruitment, employee relations, and HR policies",
          managerId: 2,
          managerName: "HR Manager",
          employeeCount: 5,
          budget: 200000,
          location: "Building A, Floor 2",
          status: "ACTIVE",
        },
        {
          id: 3,
          name: "Engineering",
          description: "Software development and technical operations",
          managerId: 3,
          managerName: "John Employee",
          parentDepartmentId: 1,
          parentDepartmentName: "Information Technology",
          employeeCount: 12,
          budget: 800000,
          location: "Building B, Floor 1-2",
          status: "ACTIVE",
        },
        {
          id: 4,
          name: "Marketing",
          description: "Brand management and customer acquisition",
          employeeCount: 6,
          budget: 300000,
          location: "Building A, Floor 1",
          status: "ACTIVE",
        },
      ]
      setDepartments(mockDepartments)
    } catch (error) {
      console.error("Error fetching departments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // In a real app, this would make an API call
      console.log("Department data:", formData)

      if (editingDepartment) {
        // Update existing department
        setDepartments((prev) =>
          prev.map((dept) =>
            dept.id === editingDepartment.id ? { ...dept, ...formData, budget: Number(formData.budget) } : dept,
          ),
        )
      } else {
        // Create new department
        const newDepartment: Department = {
          id: Date.now(),
          ...formData,
          budget: Number(formData.budget),
          employeeCount: 0,
        }
        setDepartments((prev) => [...prev, newDepartment])
      }

      resetForm()
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error saving department:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      managerId: "",
      parentDepartmentId: "",
      budget: "",
      location: "",
      status: "ACTIVE",
    })
    setEditingDepartment(null)
  }

  const handleEdit = (department: Department) => {
    setEditingDepartment(department)
    setFormData({
      name: department.name,
      description: department.description,
      managerId: department.managerId?.toString() || "",
      parentDepartmentId: department.parentDepartmentId?.toString() || "",
      budget: department.budget?.toString() || "",
      location: department.location || "",
      status: department.status,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (departmentId: number) => {
    if (confirm("Are you sure you want to delete this department?")) {
      setDepartments((prev) => prev.filter((dept) => dept.id !== departmentId))
    }
  }

  const canManageDepartments = user?.role === "SYSTEM_ADMIN" || user?.role === "HR_MANAGER"

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading departments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Department Management</h2>
          <p className="text-muted-foreground">Manage organizational departments and structure</p>
        </div>
        {canManageDepartments && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Department
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingDepartment ? "Edit Department" : "Add New Department"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Department Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="budget">Budget</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData((prev) => ({ ...prev, budget: e.target.value }))}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">{editingDepartment ? "Update" : "Create"}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((department) => (
          <Card key={department.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-primary" />
                  {department.name}
                </CardTitle>
                <Badge variant={department.status === "ACTIVE" ? "default" : "secondary"}>{department.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{department.description}</p>

              {department.managerName && (
                <div className="text-sm">
                  <span className="font-medium">Manager: </span>
                  {department.managerName}
                </div>
              )}

              {department.parentDepartmentName && (
                <div className="text-sm">
                  <span className="font-medium">Parent: </span>
                  {department.parentDepartmentName}
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                  {department.employeeCount} employees
                </div>
                {department.budget && <div className="font-medium">${department.budget.toLocaleString()}</div>}
              </div>

              {department.location && <div className="text-sm text-muted-foreground">📍 {department.location}</div>}

              {canManageDepartments && (
                <div className="flex justify-end space-x-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(department)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(department.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
