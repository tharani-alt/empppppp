"use client"

import { useAuth } from "@/lib/auth-context"
import { PermissionGuard } from "@/components/auth/permission-guard"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Badge } from "@/components/ui/badge"
import { Building2, LogOut, Settings, User, Users, BarChart3, Shield } from "lucide-react"
import { PERMISSIONS } from "@/lib/permissions"
import Link from "next/link"

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return null
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "SYSTEM_ADMIN":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "HR_MANAGER":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "HR_STAFF":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "DEPARTMENT_MANAGER":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold">Employee Management</h1>
              </div>
            </Link>

            {/* Navigation Menu */}
            <NavigationMenu>
              <NavigationMenuList>
                <PermissionGuard permission={PERMISSIONS.EMPLOYEE_READ}>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Employees</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid gap-3 p-4 w-[400px]">
                        <NavigationMenuLink asChild>
                          <Link
                            href="/employees"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Employee Directory
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              View and manage employee information
                            </p>
                          </Link>
                        </NavigationMenuLink>
                        <PermissionGuard permission={PERMISSIONS.EMPLOYEE_WRITE}>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/employees/new"
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none">Add Employee</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Register new employees
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </PermissionGuard>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </PermissionGuard>

                <PermissionGuard permission={PERMISSIONS.DEPARTMENT_READ}>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/departments"
                        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                      >
                        Departments
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </PermissionGuard>

                <PermissionGuard permission={PERMISSIONS.DEPARTMENT_READ}>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/organization"
                        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                      >
                        Organization
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </PermissionGuard>

                <PermissionGuard permission={PERMISSIONS.REPORTS_READ}>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/reports"
                        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                      >
                        Reports
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </PermissionGuard>

                <PermissionGuard permission={PERMISSIONS.SYSTEM_ADMIN}>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Administration</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid gap-3 p-4 w-[400px]">
                        <NavigationMenuLink asChild>
                          <Link
                            href="/admin/users"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none flex items-center gap-2">
                              <User className="h-4 w-4" />
                              User Management
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Manage user accounts and permissions
                            </p>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/admin/roles"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none flex items-center gap-2">
                              <Shield className="h-4 w-4" />
                              Role Management
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Configure roles and permissions
                            </p>
                          </Link>
                        </NavigationMenuLink>
                        <PermissionGuard permission={PERMISSIONS.AUDIT_READ}>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/admin/audit"
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none flex items-center gap-2">
                                <BarChart3 className="h-4 w-4" />
                                Audit Logs
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                View system audit trails
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </PermissionGuard>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </PermissionGuard>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <>
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm font-medium">{user.username}</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className={getRoleColor(user.role)}>
                      {user.role.replace("_", " ")}
                    </Badge>
                    {user.department && <span className="text-xs text-muted-foreground">{user.department}</span>}
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(user.username)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.username}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                        {user.employeeId && (
                          <p className="text-xs leading-none text-muted-foreground">ID: {user.employeeId}</p>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
