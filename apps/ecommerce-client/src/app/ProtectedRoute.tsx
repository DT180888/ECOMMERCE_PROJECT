import React from "react";
import { Navigate } from "react-router-dom";
import useHasRole from "@shared/hooks/useHasRole";

interface ProtectedRouteProps {
  roles: string[];
  children: React.ReactNode; 
}

export default function ProtectedRoute({ roles, children }: ProtectedRouteProps) {
  const { hasAny } = useHasRole();
  return hasAny(roles) ? <>{children}</> : <Navigate to="/auth/login" replace />;
}
