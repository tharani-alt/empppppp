"use client"

import type React from "react"
import { useAuth } from "@/lib/auth-context"
import { hasPermission, hasAnyPermission, type Permission } from "@/lib/permissions"

interface PermissionGuardProps {
  children: React.ReactNode
  permission?: Permission
  permissions?: Permission[]
  requireAll?: boolean
  fallback?: React.ReactNode
  showFallback?: boolean
}

export function PermissionGuard({
  children,
  permission,
  permissions,
  requireAll = false,
  fallback = null,
  showFallback = false,
}: PermissionGuardProps) {
  const { user } = useAuth()

  if (!user) {
    return showFallback ? <>{fallback}</> : null
  }

  let hasAccess = false

  if (permission) {
    hasAccess = hasPermission(user.role, permission)
  } else if (permissions && permissions.length > 0) {
    if (requireAll) {
      hasAccess = permissions.every((p) => hasPermission(user.role, p))
    } else {
      hasAccess = hasAnyPermission(user.role, permissions)
    }
  } else {
    // No permissions specified, allow access
    hasAccess = true
  }

  if (!hasAccess) {
    return showFallback ? <>{fallback}</> : null
  }

  return <>{children}</>
}
