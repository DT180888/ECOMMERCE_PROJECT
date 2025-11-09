import { Outlet, useLocation } from "react-router-dom";
import AppHeader from "@widgets/Header/AppHeader";
import Sidebar from "@widgets/Sidebar/Sidebar"; // Sidebar không còn nhận props để điều khiển
import Footer from "@widgets/Footer/Footer";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import NeatBackground from "@shared/ui/NeatBackground";

export default function MainLayout() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const footerRef = useRef<HTMLElement | null>(null);

  const location = useLocation();
  const hideSidebarPaths = ["/"];
  const shouldShowSidebar = !hideSidebarPaths.includes(location.pathname);

  // Không cần isSidebarCollapsed và toggleSidebarCollapse trong MainLayout nữa
  // const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); 

  useLayoutEffect(() => {
    const root = rootRef.current!;
    const header = headerRef.current!;
    const footer = footerRef.current!;

    function readH(el: HTMLElement) {
      return Math.round(el.getBoundingClientRect().height);
    }

    const updateVars = () => {
      const h = readH(header);
      const f = readH(footer);
      root.style.setProperty("--hdr", `${h}px`);
      root.style.setProperty("--ftr", `${f}px`);
    };

    updateVars();

    const onResize = () => {
      updateVars();
    };
    window.addEventListener("resize", onResize);

    const ro = new ResizeObserver(updateVars);
    ro.observe(header);
    ro.observe(footer);

    const mo = new MutationObserver(updateVars);
    mo.observe(header, { childList: true, subtree: true, attributes: true });
    mo.observe(footer, { childList: true, subtree: true, attributes: true });

    requestAnimationFrame(updateVars);

    return () => {
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      mo.disconnect();
    };
  }, []);

  // Hàm toggleSidebarCollapse không còn ở đây nữa

  return (
    <div
      ref={rootRef}
      className="min-h-dvh flex flex-col relative overflow-hidden main-bg"
      style={{ ["--hdr" as any]: "0px", ["--ftr" as any]: "0px" }}
    >
      <div className="main-bg">
        <NeatBackground /> 
      </div>

      <header ref={headerRef} className="w-full top-0 z-40">
        {/* AppHeader không còn nhận onToggleSidebar nữa */}
        <AppHeader /> 
      </header>

      <div className="mx-auto w-full max-w-[1600px] px-4 md:px-6 flex items-start justify-between gap-3 flex-1">
        {/* {shouldShowSidebar && (
          <aside className="flex-shrink-0  transition-all duration-300 ease-in-out"> 
            <Sidebar /> 
          </aside>
        )} */}  {/* Khi nào cần sidebar thì bỏ comment đoạn này */}

        <main className="min-h-0 w-full flex-1">
          <Outlet />
        </main>
      </div>

      <footer ref={footerRef} className="sticky bottom-0 z-40">
        <Footer />
      </footer>
    </div>
  );
}