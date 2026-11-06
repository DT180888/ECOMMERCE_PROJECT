import { useState, forwardRef, InputHTMLAttributes } from "react";
import { cn } from "../shared/utils";

export interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, error, ...props }, ref) => {
    const [show, setShow] = useState(false);
    
    return (
      <div className="relative w-full">
        <input
          ref={ref}
          type={show ? "text" : "password"}
          className={cn(
            // Base styles (Fluent Blue: 34px standard control height, 6px radius, responsive touch & iOS auto-zoom prevention)
            "w-full rounded-md",
            "h-10 sm:h-[34px] px-3 py-2 sm:py-1.5 pr-12", 
            "outline-none transition-all duration-150",
            "text-base sm:text-[13px] font-sans text-foreground", 

            // Colors & Tokens
            "bg-card text-foreground border border-border shadow-sm",
            "placeholder:text-muted-foreground/70 placeholder:text-sm sm:placeholder:text-xs",

            // Focus State & Error Handling
            error
              ? "border-error focus:border-error focus:ring-2 focus:ring-error/20 bg-error/5"
              : "focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-card",

            // Disabled
            "disabled:opacity-50 disabled:bg-surface-tertiary disabled:cursor-not-allowed",

            className
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 text-xs sm:text-[11px] font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors focus:outline-none min-h-[36px] min-w-[36px] px-2 flex items-center justify-center rounded touch-manipulation"
          aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        >
          {show ? "Ẩn" : "Hiện"}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
