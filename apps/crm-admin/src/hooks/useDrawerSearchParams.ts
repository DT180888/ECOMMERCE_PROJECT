import { useSearchParams } from "react-router-dom";
import { useCallback, useMemo } from "react";

export interface DrawerSearchParamsOptions {
  actionParam?: string;
  editParam?: string;
}

export function useDrawerSearchParams(options?: DrawerSearchParamsOptions) {
  const actionParamKey = options?.actionParam ?? "action";
  const editParamKey = options?.editParam ?? "edit";

  const [searchParams, setSearchParams] = useSearchParams();

  const isCreateOpen = useMemo(() => {
    return searchParams.get(actionParamKey) === "create";
  }, [searchParams, actionParamKey]);

  const editingId = useMemo(() => {
    const val = searchParams.get(editParamKey);
    if (!val) return null;
    const num = Number(val);
    return isNaN(num) ? val : num;
  }, [searchParams, editParamKey]);

  const isOpen = isCreateOpen || editingId !== null;

  const openCreate = useCallback(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set(actionParamKey, "create");
      next.delete(editParamKey);
      return next;
    }, { replace: true });
  }, [setSearchParams, actionParamKey, editParamKey]);

  const openEdit = useCallback((id: number | string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set(editParamKey, String(id));
      next.delete(actionParamKey);
      return next;
    }, { replace: true });
  }, [setSearchParams, editParamKey, actionParamKey]);

  const closeDrawer = useCallback(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete(actionParamKey);
      next.delete(editParamKey);
      return next;
    }, { replace: true });
  }, [setSearchParams, actionParamKey, editParamKey]);

  return {
    isOpen,
    isCreateOpen,
    editingId,
    openCreate,
    openEdit,
    closeDrawer,
    searchParams,
    setSearchParams,
  };
}
