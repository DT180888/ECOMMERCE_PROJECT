import { Navigate, useLocation } from "react-router-dom";
import { JSX } from "react";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const loc = useLocation();
  if (!token) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  return children;
}