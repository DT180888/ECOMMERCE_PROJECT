import { HTMLAttributes } from "react";
import { cn } from "./utils";

export interface KbdProps extends HTMLAttributes<HTMLElement> {}

export function Kbd({ className, children, ...props }: KbdProps) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center justify-center rounded-inner border border-foreground/10 bg-background px-1.5 py-0.5 font-mono text-[10px] font-medium leading-none text-foreground shadow-neo-sm select-none",
        className
      )}
      {...props}
    >
      {children}
    </kbd>
  );
}
