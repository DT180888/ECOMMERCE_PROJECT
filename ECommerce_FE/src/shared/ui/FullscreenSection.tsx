import clsx from "clsx";
import { ReactNode } from "react";

export default function FullscreenSection({
  id, children, className, center,
}: { id?: string; children?: ReactNode; className?: string; center?: boolean }) {
  return (
    <section
      id={id}
      className={clsx(
        "snap-start py-3 overflow-hidden box-border ",
        center && "flex items-center",
        className 
      )}
      style={{ height: "100%",
               width: "100%"
       }} 
    >
      <div className="w-full max-w-[1576px] p-3 rounded-[12px] background-glass h-[100%]">
        {children}
      </div>
    </section>
  );
}
