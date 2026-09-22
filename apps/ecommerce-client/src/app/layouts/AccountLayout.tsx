import { Outlet, useLocation } from "react-router-dom";

export default function AccountLayout() {
  const location = useLocation();
  const isDashboard = location.pathname === "/account" || location.pathname === "/account/";

  return (
    <div className="client-page-container pt-6 md:pt-10 pb-20 animate-in fade-in duration-500">
      {isDashboard ? (
        <main className="w-full">
          <Outlet />
        </main>
      ) : (
        <main className="w-full bg-background rounded-card  p-6 md:p-8">
          <Outlet />
        </main>
      )}
    </div>
  );
}