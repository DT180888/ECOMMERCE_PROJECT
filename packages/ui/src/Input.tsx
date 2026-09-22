import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "./utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          // Base styles (Cấu trúc & Kích thước)
          "w-full rounded-button",
          "h-[32px] px-3 py-2", 
          "outline-none transition-all duration-300 ease-out",
          "text-sm font-medium tracking-tight", 

          // Colors & Design Tokens (Flat Fill-to-Outline)
          "bg-foreground/[0.1] text-foreground border border-transparent",
          "placeholder:text-foreground/45 placeholder:text-xs",

          // Focus State & Error Handling
          error
            ? "border-error bg-error/5 ring-1 ring-error"
            : "focus:border-foreground/40 focus:bg-background focus:ring-1 focus:ring-foreground/20",

          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
