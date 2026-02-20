"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/auth";
import { authApi } from "@/lib/api/auth";
import { config } from "@/lib/constants/config";
import { convertApiRoleToUserRole, UserStatus } from "@/lib/types";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setToken, setLoading, logout } = useAuthStore();

  useEffect(() => {
    // Check for existing token and restore session
    const restoreSession = async () => {
      setLoading(true);

      try {
        // Get token from localStorage
        const token = localStorage.getItem(config.auth.tokenKey);

        if (!token) {
          setLoading(false);
          return;
        }

        // Verify session with backend
        const response = await authApi.getSession();

        if (response.success && response.data) {
          // Restore user session
          setUser({
            id: response.data.userId,
            email: response.data.email,
            name: "", // Backend doesn't return name in session response
            role: convertApiRoleToUserRole(response.data.role),
            phone: "",
            status: UserStatus.ACTIVE,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          setToken(token);
        } else {
          // Invalid token, clear auth
          logout();
          localStorage.removeItem(config.auth.tokenKey);
        }
      } catch (error) {
        console.error("Session restoration failed:", error);
        logout();
        localStorage.removeItem(config.auth.tokenKey);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, [setUser, setToken, setLoading, logout]);

  return <>{children}</>;
}