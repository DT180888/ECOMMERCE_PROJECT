import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type LayoutMode = "sidebar" | "topbar";

interface LayoutContextValue {
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
  toggleLayoutMode: () => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebarCollapse: () => void;
}

const LayoutContext = createContext<LayoutContextValue | undefined>(undefined);

const STORAGE_KEY_MODE = "crm_layout_mode";
const STORAGE_KEY_COLLAPSED = "crm_sidebar_collapsed";

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [layoutMode, setLayoutModeState] = useState<LayoutMode>(() => {
    if (typeof window === "undefined") return "sidebar";
    const saved = localStorage.getItem(STORAGE_KEY_MODE) as LayoutMode | null;
    return saved === "topbar" || saved === "sidebar" ? saved : "sidebar";
  });

  const [isSidebarCollapsed, setIsSidebarCollapsedState] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem(STORAGE_KEY_COLLAPSED);
    return saved === "true";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MODE, layoutMode);
  }, [layoutMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_COLLAPSED, String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  const setLayoutMode = (mode: LayoutMode) => {
    setLayoutModeState(mode);
  };

  const toggleLayoutMode = () => {
    setLayoutModeState((prev) => (prev === "sidebar" ? "topbar" : "sidebar"));
  };

  const setIsSidebarCollapsed = (collapsed: boolean) => {
    setIsSidebarCollapsedState(collapsed);
  };

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsedState((prev) => !prev);
  };

  // Keyboard shortcut: Cmd+B / Ctrl+B to toggle sidebar collapse
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        toggleSidebarCollapse();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <LayoutContext.Provider
      value={{
        layoutMode,
        setLayoutMode,
        toggleLayoutMode,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        toggleSidebarCollapse,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayoutMode(): LayoutContextValue {
  const ctx = useContext(LayoutContext);
  if (!ctx) {
    throw new Error("useLayoutMode must be used within a LayoutProvider");
  }
  return ctx;
}

