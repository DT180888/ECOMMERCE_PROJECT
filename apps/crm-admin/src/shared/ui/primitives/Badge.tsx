import { HTMLAttributes, forwardRef } from "react";
import { cn } from "../shared/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "flat" | "raised" | "inset" | "primary" | "success" | "error" | "warning" | "info";
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "raised", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-sans font-medium border transition-colors duration-150 select-none",
          variant === "flat" && "bg-surface text-foreground border-border",
          variant === "raised" && "bg-card text-foreground border border-border shadow-sm",
          variant === "inset" && "bg-surface-tertiary text-foreground border border-border-subtle shadow-none",
          variant === "primary" && "bg-primary/10 text-primary border border-primary/20 shadow-none",
          variant === "success" && "bg-success/10 text-success border border-success/20 shadow-none",
          variant === "warning" && "bg-warning/10 text-warning border border-warning/20 shadow-none",
          variant === "info" && "bg-info/10 text-info border border-info/20 shadow-none",
          variant === "error" && "bg-error/10 text-error border border-error/20 shadow-none",
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";
