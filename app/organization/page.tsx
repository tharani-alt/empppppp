"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProtectedRoute } from "@/components/layout/protected-route"
import { OrgChart } from "@/components/organization/org-chart"
import { DepartmentManagement } from "@/components/organization/department-management"
import { Building2, MapIcon as Sitemap } from "lucide-react"

export default function OrganizationPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Organization</h1>
          <p className="text-muted-foreground">Manage organizational structure, departments, and reporting hierarchy</p>
        </div>

        <Tabs defaultValue="org-chart" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="org-chart" className="flex items-center space-x-2">
              <Sitemap className="h-4 w-4" />
              <span>Organizational Chart</span>
            </TabsTrigger>
            <TabsTrigger value="departments" className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span>Department Management</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="org-chart">
            <OrgChart />
          </TabsContent>

          <TabsContent value="departments">
            <DepartmentManagement />
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}
