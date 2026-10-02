import React from "react";

export const PageLoader: React.FC = () => {
  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-3 p-8">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-widest text-muted/70 animate-pulse">
        Đang tải trang...
      </p>
    </div>
  );
};

export default PageLoader;
