"use client"

import type { Employee } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Phone, Building2, Briefcase, Calendar, MapPin, Edit, X } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface EmployeeDetailProps {
  employee: Employee
  onEdit?: (employee: Employee) => void
  onClose?: () => void
}

export function EmployeeDetail({ employee, onEdit, onClose }: EmployeeDetailProps) {
  const { user } = useAuth()
  const canEdit = user?.role === "HR_STAFF" || user?.role === "HR_MANAGER" || user?.role === "SYSTEM_ADMIN"

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

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—"
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Employee Details
          </CardTitle>
          <div className="flex gap-2">
            {canEdit && (
              <Button variant="outline" size="sm" onClick={() => onEdit?.(employee)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Header */}
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">{getInitials(employee.firstName, employee.lastName)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">
              {employee.firstName} {employee.lastName}
            </h2>
            <p className="text-muted-foreground">{employee.designationTitle || "Employee"}</p>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline" className={getStatusColor(employee.status)}>
                {employee.status || "ACTIVE"}
              </Badge>
              {employee.employmentType && (
                <Badge variant="outline" className={getEmploymentTypeColor(employee.employmentType)}>
                  {employee.employmentType.replace("_", " ")}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{employee.email}</p>
              </div>
            </div>
            {employee.phoneNumber && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{employee.phoneNumber}</p>
                </div>
              </div>
            )}
          </div>
          {employee.address && (
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{employee.address}</p>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Employment Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Employment Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Employee ID</p>
                <p className="font-medium font-mono">{employee.employeeId}</p>
              </div>
            </div>
            {employee.departmentName && (
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">{employee.departmentName}</p>
                </div>
              </div>
            )}
            {employee.dateOfJoining && (
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Date of Joining</p>
                  <p className="font-medium">{formatDate(employee.dateOfJoining)}</p>
                </div>
              </div>
            )}
            {employee.managerName && (
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Manager</p>
                  <p className="font-medium">{employee.managerName}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Information */}
        {(employee.previousEmployer || employee.dateOfBirth) && (
          <>
            <Separator />
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {employee.previousEmployer && (
                  <div>
                    <p className="text-sm text-muted-foreground">Previous Employer</p>
                    <p className="font-medium">{employee.previousEmployer}</p>
                  </div>
                )}
                {employee.dateOfBirth && (
                  <div>
                    <p className="text-sm text-muted-foreground">Date of Birth</p>
                    <p className="font-medium">{formatDate(employee.dateOfBirth)}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Timestamps */}
        {(employee.createdAt || employee.updatedAt) && (
          <>
            <Separator />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Record Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                {employee.createdAt && (
                  <div>
                    <p>Created: {formatDate(employee.createdAt)}</p>
                  </div>
                )}
                {employee.updatedAt && (
                  <div>
                    <p>Last Updated: {formatDate(employee.updatedAt)}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
