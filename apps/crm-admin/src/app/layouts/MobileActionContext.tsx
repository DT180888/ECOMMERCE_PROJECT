import React, { createContext, useContext, useState, useMemo, useCallback, useEffect, useRef } from "react";

export interface MobileActionItem {
  id?: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  isPrimary?: boolean;
  disabled?: boolean;
}

export interface MobileFilterConfig {
  activeCount?: number;
  onOpenFilter?: () => void;
  label?: string;
}

interface MobileActionState {
  actions: MobileActionItem[];
  filterConfig: MobileFilterConfig | null;
}

interface MobileActionDispatch {
  setActions: (actions: MobileActionItem[] | ((prev: MobileActionItem[]) => MobileActionItem[])) => void;
  setFilterConfig: (config: MobileFilterConfig | null | ((prev: MobileFilterConfig | null) => MobileFilterConfig | null)) => void;
}

const MobileActionStateContext = createContext<MobileActionState>({
  actions: [],
  filterConfig: null,
});

const MobileActionDispatchContext = createContext<MobileActionDispatch>({
  setActions: () => {},
  setFilterConfig: () => {},
});

export function MobileActionProvider({ children }: { children: React.ReactNode }) {
  const [actions, _setActions] = useState<MobileActionItem[]>([]);
  const [filterConfig, _setFilterConfig] = useState<MobileFilterConfig | null>(null);

  // Stable dispatch with shallow equality check to avoid re-renders
  const setActions = useCallback((newActions: MobileActionItem[] | ((prev: MobileActionItem[]) => MobileActionItem[])) => {
    _setActions((prev) => {
      const resolved = typeof newActions === "function" ? newActions(prev) : newActions;
      if (
        prev.length === resolved.length &&
        prev.every(
          (item, i) =>
            item.label === resolved[i]?.label &&
            item.onClick === resolved[i]?.onClick &&
            item.disabled === resolved[i]?.disabled &&
            item.isPrimary === resolved[i]?.isPrimary
        )
      ) {
        return prev;
      }
      return resolved;
    });
  }, []);

  const setFilterConfig = useCallback(
    (newConfig: MobileFilterConfig | null | ((prev: MobileFilterConfig | null) => MobileFilterConfig | null)) => {
      _setFilterConfig((prev) => {
        const resolved = typeof newConfig === "function" ? newConfig(prev) : newConfig;
        if (
          prev?.activeCount === resolved?.activeCount &&
          prev?.onOpenFilter === resolved?.onOpenFilter &&
          prev?.label === resolved?.label
        ) {
          return prev;
        }
        return resolved;
      });
    },
    []
  );

  const stateValue = useMemo<MobileActionState>(
    () => ({
      actions,
      filterConfig,
    }),
    [actions, filterConfig]
  );

  const dispatchValue = useMemo<MobileActionDispatch>(
    () => ({
      setActions,
      setFilterConfig,
    }),
    [setActions, setFilterConfig]
  );

  return (
    <MobileActionDispatchContext.Provider value={dispatchValue}>
      <MobileActionStateContext.Provider value={stateValue}>
        {children}
      </MobileActionStateContext.Provider>
    </MobileActionDispatchContext.Provider>
  );
}

/** Hook to read state in BottomBar */
export function useMobileActionState() {
  return useContext(MobileActionStateContext);
}

/** Hook to get stable dispatch methods */
export function useMobileActionDispatch() {
  return useContext(MobileActionDispatchContext);
}

/** Backward compatible combined hook */
export function useMobileAction() {
  const state = useContext(MobileActionStateContext);
  const dispatch = useContext(MobileActionDispatchContext);
  return {
    ...state,
    ...dispatch,
  };
}

/**
 * Dedicated hook to register a primary action from any page
 * Uses ref internally so handler changes do not cause effect loops.
 */
export function useRegisterMobileAction(action: MobileActionItem | null) {
  const { setActions } = useMobileActionDispatch();
  const actionRef = useRef(action);
  actionRef.current = action;

  useEffect(() => {
    if (!action) {
      setActions([]);
      return;
    }

    setActions([
      {
        label: action.label,
        onClick: () => actionRef.current?.onClick(),
        isPrimary: action.isPrimary ?? true,
        disabled: action.disabled,
        icon: action.icon,
      },
    ]);

    return () => {
      setActions([]);
    };
  }, [action?.label, action?.disabled, action?.isPrimary, setActions]);
}

/**
 * Dedicated hook to register filter config from any page
 */
export function useRegisterMobileFilter(filter: MobileFilterConfig | null) {
  const { setFilterConfig } = useMobileActionDispatch();
  const filterRef = useRef(filter);
  filterRef.current = filter;

  useEffect(() => {
    if (!filter) {
      setFilterConfig(null);
      return;
    }

    setFilterConfig({
      activeCount: filter.activeCount,
      onOpenFilter: () => filterRef.current?.onOpenFilter?.(),
      label: filter.label,
    });

    return () => {
      setFilterConfig(null);
    };
  }, [filter?.activeCount, filter?.label, setFilterConfig]);
}
