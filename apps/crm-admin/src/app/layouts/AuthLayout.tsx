import { Suspense } from "react";
import { Outlet, Link } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 sm:p-8 animate-in fade-in duration-1000">
      
      {/* Global Back Link */}
      <div className="fixed top-8 left-8 sm:top-12 sm:left-12 z-20">
        <Link 
          to="/" 
          className="group flex items-center gap-3 text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em] hover:text-foreground transition-colors"
        >
          <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center group-hover:bg-surface transition-colors">
            <ArrowLeftIcon className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          </div>
          Trang chủ
        </Link>
      </div>

      {/* Main Content Area (Pages will provide their own card) */}
      <div className="w-full flex justify-center py-10 transition-all">
        <Suspense fallback={<div className="h-64 flex items-center justify-center text-xs font-mono text-muted-foreground animate-pulse">Đang tải...</div>}>
          <Outlet />
        </Suspense>
      </div>

      {/* Footer helper for Auth */}
      <div className="fixed bottom-8 text-center sm:bottom-12">
         <p className="text-[10px] font-black text-muted uppercase tracking-[0.3em]">Minimalism 2.0 Auth Flow</p>
      </div>

    </div>
  );
}