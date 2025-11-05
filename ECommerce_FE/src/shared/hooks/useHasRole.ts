// src/shared/hooks/useHasRole.ts
import { useMe } from "@features/auth/api";
export default function useHasRole(role: string) {
  const { data } = useMe();
  return !!data?.roles?.includes(role);
}
