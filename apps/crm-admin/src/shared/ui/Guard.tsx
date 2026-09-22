import React from "react";
import usePermission from "../hooks/usePermission";

type GuardProps = {
  permission: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
};

export default function Guard({ permission, fallback = null, children }: GuardProps) {
  const { hasPermission } = usePermission();

  if (!hasPermission(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
