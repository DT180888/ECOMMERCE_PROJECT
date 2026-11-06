import { forwardRef, TextareaHTMLAttributes } from "react";
import { cn } from "../shared/utils";

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          // Base styles (Fluent Blue: 6px radius, responsive touch & iOS auto-zoom prevention)
          "w-full rounded-md",
          "px-3 py-2",
          "outline-none transition-all duration-150",
          "text-base sm:text-[13px] font-sans text-foreground",
          "resize-y min-h-[80px]",

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
    );
  }
);

TextArea.displayName = "TextArea";
