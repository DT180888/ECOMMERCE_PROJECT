// src/app/AuthGate.tsx
import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthUser } from "@hooks/useAuth";
import { clientSideLogout } from "@my-project/shared-utils";
import useHasRole from "@hooks/useHasRole";
import usePermission from "@hooks/usePermission";

export default function AuthGate({ children }: PropsWithChildren) {
  const nav = useNavigate();
  const location = useLocation();
  const { data: me, error, isFetching } = useAuthUser();
  const { roles, has } = useHasRole();
  const { getDefaultAdminRoute } = usePermission();
  
  const hasAccess = roles.length > 0 && !has("Customer");

  useEffect(() => {
    const status = (error as any)?.response?.status;
    if (status === 401) {
      clientSideLogout();       // xoá token + chuyển về /login
    }
  }, [error, nav]);

  useEffect(() => {
    if (me && !hasAccess) {
      clientSideLogout();
    }
  }, [me, hasAccess]);

  useEffect(() => {
    if (me && hasAccess && location.pathname.startsWith("/auth")) {
      nav(getDefaultAdminRoute(), { replace: true });
    }
  }, [me, hasAccess, location.pathname, nav, getDefaultAdminRoute]);

  // Có thể hiển thị skeleton thay vì null khi đang check phiên lần đầu
  if (isFetching) return null;

  return <>{children}</>;
}

