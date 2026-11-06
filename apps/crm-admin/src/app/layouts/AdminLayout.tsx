import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@components/layout/Sidebar";
import { AdminHeader } from "@components/layout/AdminHeader";
import { AdminMobileBottomBar } from "@components/layout/AdminMobileBottomBar";
import { AdminMobileHeader } from "@components/layout/AdminMobileHeader";
import { AdminPageFallback } from "@shared/ui";
import { LayoutProvider, useLayoutMode } from "./LayoutContext";
import { MobileActionProvider } from "./MobileActionContext";

function AdminLayoutInner() {
  const location = useLocation();
  const hideSidebarPaths = ["/"];
  const shouldShowSidebar = !hideSidebarPaths.includes(location.pathname);
  const { layoutMode } = useLayoutMode();

  const isTopbarMode = layoutMode === "topbar";

  return (
    <div className="min-h-screen md:h-screen w-full flex flex-col md:flex-row relative bg-background font-sans text-foreground">
      {/* ── Desktop Sidebar ── */}
      {shouldShowSidebar && !isTopbarMode && (
        <aside className="hidden md:flex flex-col shrink-0 z-20 h-full border-r border-border">
          <Sidebar />
        </aside>
      )}

      {/* ── Main Canvas Column (Positioned to the right of Sidebar) ── */}
      <div className="flex-1 flex flex-col min-w-0 md:min-h-0">
        {/* Desktop Header */}
        {shouldShowSidebar && <AdminHeader />}

        {/* Mobile Header: Full-width sticky topbar on mobile (<md) */}
        {shouldShowSidebar && <AdminMobileHeader />}

        {/* ── Workspace Canvas (Pure Editorial Spacing: px-4 md:px-6 py-4 md:py-6) ── */}
        <main className="flex-1 min-w-0 flex flex-col overflow-y-auto h-full bg-background px-4 md:px-6 py-4 md:py-6">
          <Suspense fallback={<AdminPageFallback />}>
            <Outlet />
          </Suspense>
        </main>
      </div>

      {/* ── Mobile Bottom Navigation Bar (md:hidden) ── */}
      {shouldShowSidebar && <AdminMobileBottomBar />}
    </div>
  );
}

export default function AdminLayout() {
  return (
    <LayoutProvider>
      <MobileActionProvider>
        <AdminLayoutInner />
      </MobileActionProvider>
    </LayoutProvider>
  );
}
