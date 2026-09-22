import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@widgets/sidebar/Sidebar";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function AdminLayout() {
  const location = useLocation();
  const hideSidebarPaths = ["/"];
  const shouldShowSidebar = !hideSidebarPaths.includes(location.pathname);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-screen bg-background flex flex-col md:flex-row relative text-foreground overflow-hidden  md:p-4 gap-3 md:gap-4">
      {/* ── Desktop Sidebar Container ── */}
      {shouldShowSidebar && (
        <aside className="hidden md:block h-full shrink-0 z-30">
          <Sidebar />
        </aside>
      )}

      {/* ── Mobile Sidebar Drawer ── */}
      {shouldShowSidebar && (
        <>
          {/* Mobile Overlay Backdrop */}
          <div
            className={`fixed inset-0 bg-background/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ease-in-out ${
              isMobileSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setIsMobileSidebarOpen(false)}
          />

          {/* Sliding Sidebar Panel */}
          <aside
            className={`fixed top-0 bottom-0 left-0 z-50 p-4 w-72 md:hidden transition-transform duration-300 ease-out ${
              isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* Close Button on Mobile Drawer */}
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="absolute top-7 right-7 p-1.5 rounded-button bg-surface border border-foreground/5 text-foreground hover:bg-surface-hover transition-colors z-50"
              aria-label="Close menu"
            >
              <XMarkIcon className="w-3 h-3 md:w-4 md:h-4" />
            </button>
            <Sidebar onClose={() => setIsMobileSidebarOpen(false)} />
          </aside>
        </>
      )}

      {/* ── Main View Area ── */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Mobile Sticky Header */}
        {shouldShowSidebar && (
          <header className="md:hidden flex items-center justify-between p-4 md:p-6 h-11 bg-card border-b border-foreground/20 z-30 sticky top-0 shadow-neo-sm shrink-0 rounded-card">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2.5 rounded-button bg-surface border border-foreground/5 text-foreground hover:bg-surface-hover transition-all duration-200 shadow-neo-sm"
              aria-label="Open menu"
            >
              <Bars3Icon className="w-3 h-3 md:w-4 md:h-4" />
            </button>
            
            <div className="font-display font-bold text-xs tracking-tight text-foreground flex items-center gap-1.5">
              <div className="w-3 h-3 md:w-4 md:h-4 bg-primary rounded-inner flex items-center justify-center">
                <span className="text-primary-foreground text-[8px] leading-none">E</span>
              </div>
              <span>Admin Panel</span>
            </div>
            
            <div className="w-6" /> {/* Visual spacing balance */}
          </header>
        )}

        {/* Main Editorial Canvas */}
        <main className="flex-1 w-full overflow-y-auto overflow-x-clip custom-scrollbar p-3 md:p-0 rounded-card relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

