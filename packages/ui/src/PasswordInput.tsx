import { useState, forwardRef, InputHTMLAttributes } from "react";
import { cn } from "./utils";

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
            // Base styles (giống Input.tsx)
            "w-full rounded-button",
            "h-[40px] px-3 py-2 pr-10", 
            "outline-none transition-all duration-300 ease-out",
            "text-sm font-medium tracking-tight", 
 
            // Colors & Design Tokens (Neumorphic Inset)
            "bg-background text-foreground border border-foreground/10 shadow-neo-inset",
            "placeholder:text-foreground/45",

            // Focus State & Error Handling
            error
              ? "border-error ring-2 ring-error/30 shadow-neo-inset-deep"
              : "focus:border-accent focus:ring-2 focus:ring-accent/30 focus:shadow-neo-inset-deep",

            className
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
          aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        >
          {show ? "Ẩn" : "Hiện"}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";