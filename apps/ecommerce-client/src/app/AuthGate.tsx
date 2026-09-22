// src/app/AuthGate.tsx
import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "@entities/auth/hooks";
import { clientSideLogout } from "@my-project/shared-utils";

export default function AuthGate({ children }: PropsWithChildren) {
  const nav = useNavigate();
  const { error, isFetching } = useAuthUser();

  useEffect(() => {
    const status = (error as any)?.response?.status;
    if (status === 401) {
      clientSideLogout();       // xoÃ¡ token + chuyá»ƒn vá» /login
    }
  }, [error, nav]);

  // CÃ³ thá»ƒ hiá»ƒn thá»‹ skeleton thay vÃ¬ null khi Ä‘ang check phiÃªn láº§n Ä‘áº§u
  if (isFetching) return null;

  return <>{children}</>;
}


