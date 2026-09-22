import { Outlet, useLocation } from "react-router-dom";
import AppHeader from "@widgets/client/Header/AppHeader";
import Footer from "@widgets/client/Footer/Footer";

export default function MainLayout() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="page-wrapper selection:bg-accent/30">
      {/* Header - Fixed & Glass on scroll */}
      <AppHeader />

      {/* Main Content Area — full-bleed, pages own their spacing */}
      <main className="flex-1 w-full flex flex-col animate-in fade-in duration-500">
        {/* Offset for fixed header (Anti Double-Padding Rule) */}
        {!isHome && <div className="h-16 md:h-20 w-full shrink-0" aria-hidden="true" />}
        
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}