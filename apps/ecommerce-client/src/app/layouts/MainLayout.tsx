import { Outlet, useLocation } from "react-router-dom";
import AppHeader from "@components/layout/AppHeader";
import Footer from "@components/layout/Footer";

export default function MainLayout() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="page-wrapper selection:bg-accent/30">
      {/* Header - Floating Transparent Overlay on Home, Solid Glass on Scroll */}
      <AppHeader />

      {/* Main Content Area — Full-bleed on Home page, spacer offset on inner pages */}
      <main className="flex-1 w-full flex flex-col animate-in fade-in duration-500">
        {!isHome && <div className="h-16 w-full shrink-0" aria-hidden="true" />}
        
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}