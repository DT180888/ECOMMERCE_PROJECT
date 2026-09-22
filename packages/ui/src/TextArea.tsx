import { forwardRef, TextareaHTMLAttributes } from "react";
import { cn } from "./utils";

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          // Base styles
          "w-full rounded-button",
          "px-3 py-2",
          "outline-none transition-all duration-300 ease-out",
          "text-sm font-medium tracking-tight",
          "resize-y min-h-[80px]", // Cho phép resize dọc, chiều cao tối thiểu

          // Colors & Design Tokens (Flat Fill-to-Outline)
          "bg-foreground/[0.02] text-foreground border border-transparent",
          "placeholder:text-foreground/45",

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

TextArea.displayName = "TextArea";