import { NavLink } from "react-router-dom";
import FullscreenSection from "@shared/ui/FullscreenSection";
import { HomeIcon, ShoppingCartIcon, ArchiveBoxIcon, UserGroupIcon, ChartBarIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/24/outline';
import { useState } from "react"; // Import useState

// KHÔNG CẦN SidebarProps nữa nếu Sidebar tự quản lý trạng thái

const items = [
  // { to: "/admin", label: "Dashboard", end: true, icon: <HomeIcon className="h-5 w-5" /> },
  { to: "/reports", label: "Dashboard", end: true, icon: <ChartBarIcon className="h-5 w-5" /> },

  { to: "/admin/brand", label: "Brand", icon: <ShoppingCartIcon className="h-5 w-5" /> },
  { to: "/admin/category", label: "category", icon: <ArchiveBoxIcon className="h-5 w-5" /> },
  { to: "/admin/product", label: "product", icon: <UserGroupIcon className="h-5 w-5" /> },
];

// Sidebar không nhận props isCollapsed hay onClose nữa
export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true); // Sidebar tự quản lý trạng thái

  const toggleSidebarCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <nav 
      className={`h-full rounded-xl flex flex-col relative 
                  transition-all duration-200 ease-in-out 
                  ${isCollapsed ? "w-[4rem]" : "w-36"}`}
      style={{ height: "calc(100dvh - var(--hdr,0px) - var(--ftr,0px))" }}
    >
      <button
        onClick={toggleSidebarCollapse}
        className="absolute -right-3 top-1/2 -translate-y-1/2 z-50
                   p-1 rounded-full bg-gray-200 dark:bg-gray-700
                   shadow-md hover:bg-gray-300 dark:hover:bg-gray-600
                   text-gray-700 dark:text-gray-300 transition-colors duration-200"
      >
        {isCollapsed ? (
          <ChevronDoubleRightIcon className="h-4 w-4" />
        ) : (
          <ChevronDoubleLeftIcon className="h-4 w-4" />
        )}
      </button>
      <div
        className="flex-1 overflow-y-auto snap-y snap-mandatory scroll-smooth
                   [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        style={{ height: "calc(100dvh - var(--hdr,0px) - var(--ftr,0px) - 2rem)" }}
      >
        <FullscreenSection center className="bg-transparent">
          <ul className="space-y-1">
            {items.map((it) => (
              <li key={it.to}>
                <NavLink
                  to={it.to}
                  end={it.end as any}
                  className={({ isActive }) =>
                    [
                      "flex items-center rounded-lg px-2 py-2 text-sm",
                      isActive
                        ? "bg-gray-900 text-white dark:bg-gray-700"
                        : "hover:bg-gray-50 text-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white",
                      isCollapsed ? "justify-center" : "",
                    ].join(" ")
                  }
                >
                  {it.icon}
                  <span className={`${isCollapsed ? "hidden" : "ml-3"} whitespace-nowrap`}>
                    {it.label}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </FullscreenSection>
      </div>
    </nav>
  );
}