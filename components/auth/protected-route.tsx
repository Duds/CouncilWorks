"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { Route } from "next";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredRoles?: string[];
}

export function ProtectedRoute({ children, requiredRole, requiredRoles }: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading

    if (!session) {
      router.push("/auth/sign-in");
      return;
    }

    // Check role permissions
    const userRole = session.user.role;
    const rolesToCheck = requiredRoles || (requiredRole ? [requiredRole] : []);
    
    if (rolesToCheck.length > 0 && !rolesToCheck.includes(userRole)) {
      router.push("/unauthorized" as Route);
      return;
    }
  }, [session, status, router, requiredRole, requiredRoles]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect
  }

  // Check role permissions
  const userRole = session.user.role;
  const rolesToCheck = requiredRoles || (requiredRole ? [requiredRole] : []);
  
  if (rolesToCheck.length > 0 && !rolesToCheck.includes(userRole)) {
    return null; // Will redirect
  }

  return <>{children}</>;
}
