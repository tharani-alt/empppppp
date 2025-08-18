"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Building2, ChevronDown, ChevronRight } from "lucide-react"

interface Employee {
  id: number
  employeeId: string
  fullName: string
  email: string
  department: string
  designation: string
  managerId?: number
  status: string
}

interface Department {
  id: number
  name: string
  description: string
  managerId?: number
  parentDepartmentId?: number
  employeeCount: number
}

interface OrgNode {
  employee: Employee
  subordinates: OrgNode[]
  isExpanded: boolean
}

export function OrgChart() {
  const [orgData, setOrgData] = useState<OrgNode[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchOrgData()
    fetchDepartments()
  }, [selectedDepartment])

  const fetchOrgData = async () => {
    try {
      // Mock organizational data
      const mockOrgData: OrgNode[] = [
        {
          employee: {
            id: 1,
            employeeId: "EMP001",
            fullName: "System Administrator",
            email: "admin@company.com",
            department: "IT",
            designation: "System Administrator",
            status: "ACTIVE",
          },
          subordinates: [
            {
              employee: {
                id: 3,
                employeeId: "EMP003",
                fullName: "John Employee",
                email: "employee@company.com",
                department: "Engineering",
                designation: "Software Developer",
                managerId: 1,
                status: "ACTIVE",
              },
              subordinates: [],
              isExpanded: true,
            },
          ],
          isExpanded: true,
        },
        {
          employee: {
            id: 2,
            employeeId: "EMP002",
            fullName: "HR Manager",
            email: "hr@company.com",
            department: "Human Resources",
            designation: "HR Manager",
            status: "ACTIVE",
          },
          subordinates: [],
          isExpanded: true,
        },
      ]
      setOrgData(mockOrgData)
    } catch (error) {
      console.error("Error fetching org data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchDepartments = async () => {
    try {
      const mockDepartments: Department[] = [
        { id: 1, name: "IT", description: "Information Technology", managerId: 1, employeeCount: 5 },
        { id: 2, name: "Human Resources", description: "HR Department", managerId: 2, employeeCount: 3 },
        {
          id: 3,
          name: "Engineering",
          description: "Software Engineering",
          managerId: 3,
          parentDepartmentId: 1,
          employeeCount: 8,
        },
        { id: 4, name: "Marketing", description: "Marketing Department", employeeCount: 4 },
      ]
      setDepartments(mockDepartments)
    } catch (error) {
      console.error("Error fetching departments:", error)
    }
  }

  const toggleExpansion = (nodeId: number, nodes: OrgNode[]): OrgNode[] => {
    return nodes.map((node) => {
      if (node.employee.id === nodeId) {
        return { ...node, isExpanded: !node.isExpanded }
      }
      return {
        ...node,
        subordinates: toggleExpansion(nodeId, node.subordinates),
      }
    })
  }

  const handleToggleExpansion = (nodeId: number) => {
    setOrgData((prev) => toggleExpansion(nodeId, prev))
  }

  const renderOrgNode = (node: OrgNode, level = 0) => (
    <div key={node.employee.id} className="mb-4">
      <Card className={`ml-${level * 8} transition-all duration-200 hover:shadow-md`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {node.subordinates.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleExpansion(node.employee.id)}
                  className="p-1 h-6 w-6"
                >
                  {node.isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              )}
              <div className="flex-1">
                <h4 className="font-semibold text-lg">{node.employee.fullName}</h4>
                <p className="text-sm text-muted-foreground">{node.employee.designation}</p>
                <p className="text-xs text-muted-foreground">{node.employee.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">{node.employee.department}</Badge>
              <Badge variant={node.employee.status === "ACTIVE" ? "default" : "secondary"}>
                {node.employee.status}
              </Badge>
              {node.subordinates.length > 0 && (
                <Badge variant="secondary">
                  <Users className="h-3 w-3 mr-1" />
                  {node.subordinates.length}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {node.isExpanded && node.subordinates.map((subordinate) => renderOrgNode(subordinate, level + 1))}
    </div>
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading organizational chart...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Organizational Chart</h2>
          <p className="text-muted-foreground">View company hierarchy and reporting structure</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {departments.map((dept) => (
          <Card key={dept.id}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Building2 className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">{dept.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{dept.description}</p>
              <div className="flex items-center justify-between">
                <Badge variant="outline">
                  <Users className="h-3 w-3 mr-1" />
                  {dept.employeeCount}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">{orgData.map((node) => renderOrgNode(node))}</div>
    </div>
  )
}
