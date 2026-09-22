import { Navigate } from "react-router-dom";
import usePermission from "@shared/hooks/usePermission";

export default function RootRedirect() {
  const { getDefaultAdminRoute } = usePermission();
  return <Navigate to={getDefaultAdminRoute()} replace />;
}
