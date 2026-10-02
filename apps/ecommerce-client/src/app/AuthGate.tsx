// src/app/AuthGate.tsx
import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "@hooks/useAuth";
import { clientSideLogout } from "@my-project/shared-utils";

export default function AuthGate({ children }: PropsWithChildren) {
  const nav = useNavigate();
  const { error, isFetching } = useAuthUser();

  useEffect(() => {
    const status = (error as any)?.response?.status;
    if (status === 401) {
      clientSideLogout();       // xoá token + chuyển về /login
    }
  }, [error, nav]);

  // Có thể hiển thị skeleton thay vì null khi đang check phiên lần đầu
  if (isFetching) return null;

  return <>{children}</>;
}


