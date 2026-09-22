import { HTMLAttributes, forwardRef } from "react";
import { cn } from "./utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "flat" | "raised" | "inset" | "primary" | "success" | "error";
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "raised", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-tight transition-all duration-300",
          // Neumorphic Elevation & Color variations
          variant === "flat" && "bg-background text-foreground border border-foreground/10",
          variant === "raised" && "bg-background text-foreground border border-foreground/5 shadow-neo-sm",
          variant === "inset" && "bg-secondary/40 text-foreground border border-foreground/5 shadow-none",
          variant === "primary" && "bg-primary text-primary-foreground border border-foreground/5 shadow-none",
          variant === "success" && "bg-success/15 text-success border border-success/20 shadow-none",
          variant === "error" && "bg-error/15 text-error border border-error/20 shadow-none",
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";
