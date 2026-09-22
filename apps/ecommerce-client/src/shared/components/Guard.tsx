import React from "react";
import useHasPermission from "../hooks/useHasPermission";

type GuardProps = {
  permission: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
};

export default function Guard({ permission, fallback = null, children }: GuardProps) {
  const { has } = useHasPermission();

  if (!has(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
