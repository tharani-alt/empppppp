"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { ProtectedRoute } from "@/components/layout/protected-route"
import { Navbar } from "@/components/layout/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Building2, Shield, BarChart3, Bell, Settings, CheckCircle, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const { user } = useAuth()

  const features = [
    {
      icon: Shield,
      title: "Secure Authentication",
      description: "JWT-based authentication with role-based access control",
      status: "Complete",
      href: "/auth",
    },
    {
      icon: Users,
      title: "Employee Management",
      description: "Complete employee lifecycle management system",
      status: "Complete",
      href: "/employees",
    },
    {
      icon: Building2,
      title: "Organizational Structure",
      description: "Department and hierarchy management",
      status: "In Progress",
      href: "/departments",
    },
    {
      icon: BarChart3,
      title: "Analytics & Reporting",
      description: "Comprehensive workforce analytics and insights",
      status: "Planned",
      href: "/analytics",
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Real-time notifications and alerts system",
      status: "Planned",
      href: "/notifications",
    },
    {
      icon: Settings,
      title: "System Administration",
      description: "Advanced system configuration and management",
      status: "Planned",
      href: "/admin",
    },
  ]

  const quickStats = [
    { label: "Total Employees", value: "1,234", change: "+12%", href: "/employees" },
    { label: "Active Departments", value: "24", change: "+2%", href: "/departments" },
    { label: "Pending Requests", value: "8", change: "-5%", href: "/requests" },
    { label: "System Health", value: "99.9%", change: "Stable", href: "/system" },
  ]

  const quickActions = [
    { label: "Add Employee", href: "/employees", icon: Users },
    { label: "Manage Departments", href: "/departments", icon: Building2 },
    { label: "View Reports", href: "/reports", icon: BarChart3 },
    { label: "System Settings", href: "/settings", icon: Settings },
  ]

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />

        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user?.username}!</h1>
            <p className="text-muted-foreground">Here's what's happening in your organization today.</p>
          </div>

          {/* Navigation */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-1 bg-muted rounded-lg p-1">
              {["dashboard", "features", "system"].map((tab) => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? "default" : "ghost"}
                  onClick={() => setActiveTab(tab)}
                  className="capitalize"
                >
                  {tab === "dashboard" ? "Dashboard" : tab === "features" ? "Features" : "System Status"}
                </Button>
              ))}
            </div>
          </div>

          {/* Content */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickStats.map((stat, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                    <Link href={stat.href}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground">{stat.change} from last month</p>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => (
                      <Link key={index} href={action.href}>
                        <Button
                          variant="outline"
                          className="w-full h-auto p-4 flex flex-col items-center gap-2 bg-transparent"
                        >
                          <action.icon className="h-6 w-6" />
                          <span className="text-sm">{action.label}</span>
                        </Button>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* User Role Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Your Access Level
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Role: {user?.role.replace("_", " ")}</p>
                      {user?.department && (
                        <p className="text-sm text-muted-foreground">Department: {user.department}</p>
                      )}
                      {user?.employeeId && (
                        <p className="text-sm text-muted-foreground">Employee ID: {user.employeeId}</p>
                      )}
                    </div>
                    <Badge variant="secondary" className="text-sm">
                      {user?.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "features" && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <feature.icon className="h-5 w-5 text-primary" />
                        {feature.title}
                      </div>
                      <Badge
                        variant={
                          feature.status === "Complete"
                            ? "default"
                            : feature.status === "In Progress"
                              ? "secondary"
                              : "outline"
                        }
                        className="flex items-center gap-1"
                      >
                        {feature.status === "Complete" ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : feature.status === "In Progress" ? (
                          <Clock className="h-3 w-3" />
                        ) : null}
                        {feature.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{feature.description}</p>
                    {feature.status === "Complete" && (
                      <Link href={feature.href}>
                        <Button variant="outline" size="sm" className="w-full bg-transparent">
                          Access Feature
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "system" && (
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>Current system health and performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3 text-green-600">Backend Services</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                          <span className="font-medium">Authentication API</span>
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            Online
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                          <span className="font-medium">Employee Management API</span>
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            Online
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                          <span className="font-medium">H2 Database</span>
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            Connected
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3 text-blue-600">Frontend Features</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                          <span className="font-medium">Authentication UI</span>
                          <Badge variant="outline" className="bg-blue-100 text-blue-800">
                            Active
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                          <span className="font-medium">Employee Management</span>
                          <Badge variant="outline" className="bg-blue-100 text-blue-800">
                            Active
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                          <span className="font-medium">Role-based Access</span>
                          <Badge variant="outline" className="bg-blue-100 text-blue-800">
                            Active
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
