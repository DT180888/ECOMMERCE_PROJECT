import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "../shared/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          // Base styles (Fluent Blue: 34px standard control height, 6px radius, responsive touch target & iOS auto-zoom prevention)
          "w-full rounded-md",
          "sm:h-7 h-[34px] px-3 py-2 sm:py-1.5", 
          "outline-none transition-all duration-150",
          "text-base sm:text-[13px] font-sans text-foreground", 

          // Colors & Tokens
          "bg-card text-foreground border border-border shadow-sm",
          "placeholder:text-muted-foreground/70 placeholder:text-sm sm:placeholder:text-xs",

          // Focus State & Error Handling (Fluent Blue WCAG AA ring)
          error
            ? "border-error focus:border-error focus:ring-2 focus:ring-error/20 bg-error/5"
            : "focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-card",

          // Disabled
          "disabled:opacity-50 disabled:bg-surface-tertiary disabled:cursor-not-allowed",

          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
