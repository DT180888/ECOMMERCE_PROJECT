import { HTMLAttributes } from "react";
import { cn } from "../shared/utils";

export interface KbdProps extends HTMLAttributes<HTMLElement> {}

export function Kbd({ className, children, ...props }: KbdProps) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center justify-center rounded-[2px] border border-border/60 bg-surface/50 px-1.5 py-0.5 font-mono text-[10px] font-medium leading-none text-foreground shadow-none select-none",
        className
      )}
      {...props}
    >
      {children}
    </kbd>
  );
}
