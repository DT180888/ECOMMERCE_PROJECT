import { Outlet } from "react-router-dom";
import AppHeader from "@widgets/Header/AppHeader";
import Sidebar from "@widgets/Sidebar/Sidebar";
import Footer from "@widgets/Footer/Footer";
import { useEffect, useLayoutEffect, useRef } from "react";
import NeatBackground from "@shared/ui/NeatBackground";


export default function MainLayout() {

  const rootRef   = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const footerRef = useRef<HTMLElement | null>(null);
   useLayoutEffect(() => {
    const root   = rootRef.current!;
    const header = headerRef.current!;
    const footer = footerRef.current!;

    function readH(el: HTMLElement) {
      // getBoundingClientRect chính xác hơn với sticky/transform
      return Math.round(el.getBoundingClientRect().height);
    }

    const updateVars = () => {
      const h = readH(header);
      const f = readH(footer);
      root.style.setProperty("--hdr", `${h}px`);
      root.style.setProperty("--ftr", `${f}px`);
    };

    // Cập nhật ngay khi mount
    updateVars();

    // Cập nhật khi resize viewport
    const onResize = () => updateVars();
    window.addEventListener("resize", onResize);

    // Quan sát kích thước header/footer thay đổi (responsive, font load…)
    const ro = new ResizeObserver(updateVars);
    ro.observe(header);
    ro.observe(footer);

    // Phòng khi nội dung bên trong thay đổi (menu mở rộng...)
    const mo = new MutationObserver(updateVars);
    mo.observe(header, { childList: true, subtree: true, attributes: true });
    mo.observe(footer, { childList: true, subtree: true, attributes: true });

    // Một số browser cần tick sau layout
    requestAnimationFrame(updateVars);

    return () => {
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      mo.disconnect();
    };
  }, []);



  return (
    <div  ref={rootRef}
      className="min-h-dvh grid grid-rows-[auto_1fr_auto]"
      style={{ ["--hdr" as any]: "0px", ["--ftr" as any]: "0px" }} 
    >
      <NeatBackground />

      <header ref={headerRef} className="sticky top-0 z-40">
        <AppHeader />
      </header>
      <div className="flex justify-center gap-0 md:gap-6 ">
        {/* <aside className="hidden md:block"> kHI CẦN SIDEBAR MỚI MỞ RA
          <Sidebar />
        </aside> */}

        {/* Main content */}
        <main  className="min-h-0 bg-transparent">
            <Outlet />
        </main>
      </div>
      <footer ref={footerRef} className="sticky bottom-0 z-40 bg-transparent">
        <Footer />
      </footer>
    </div>
  );
}
