"use client"

import type React from "react"
import { useAuth } from "@/lib/auth-context"

interface RoleGuardProps {
  children: React.ReactNode
  roles: string[]
  fallback?: React.ReactNode
  showFallback?: boolean
}

export function RoleGuard({ children, roles, fallback = null, showFallback = false }: RoleGuardProps) {
  const { user } = useAuth()

  if (!user || !roles.includes(user.role)) {
    return showFallback ? <>{fallback}</> : null
  }

  return <>{children}</>
}
