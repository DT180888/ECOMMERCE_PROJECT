import React from "react";
import { Navigate } from "react-router-dom";
import useHasRole from "@shared/hooks/useHasRole";

interface ProtectedRouteProps {
  children: React.ReactNode; 
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { roles, has } = useHasRole();
  const hasAccess = roles.length > 0 && !has("Customer");
  return hasAccess ? <>{children}</> : <Navigate to="/auth/login" replace />;
}
