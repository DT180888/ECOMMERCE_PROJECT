import { Outlet } from "react-router-dom";
import AppHeader from "@components/layout/AppHeader";
import Footer from "@components/layout/Footer";
import AnnouncementBar from "@components/home/AnnouncementBar";

export default function MainLayout() {
  return (
    <div className="page-wrapper min-h-screen flex flex-col selection:bg-accent/30">
      {/* Top Promotional Announcement Bar */}
      <AnnouncementBar />

      {/* Sticky App Header */}
      <AppHeader />

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col animate-in fade-in duration-500">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}