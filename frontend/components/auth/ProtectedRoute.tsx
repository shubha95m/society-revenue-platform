"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";
import { UserRole } from "@/lib/types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuthStore();

  useEffect(() => {
    // Wait for auth to finish loading
    if (isLoading) return;

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    // Check role-based access if roles are specified
    if (allowedRoles && allowedRoles.length > 0 && user) {
      const hasAccess = allowedRoles.includes(user.role);
      if (!hasAccess) {
        // Redirect to appropriate dashboard based on user's role
        const roleDashboards: Record<string, string> = {
          PLATFORM_ADMIN: "/admin/dashboard",
          SOCIETY_ADMIN: "/society/dashboard",
          RESIDENT: "/resident/dashboard",
          VENDOR: "/vendor/dashboard",
        };
        router.push(roleDashboards[user.role] || "/");
      }
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, router, redirectTo]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children until auth is verified
  if (!isAuthenticated) {
    return null;
  }

  // Check role-based access
  if (allowedRoles && allowedRoles.length > 0 && user) {
    const hasAccess = allowedRoles.includes(user.role);
    if (!hasAccess) {
      return null;
    }
  }

  return <>{children}</>;
}