import { forwardRef } from "react";
import type { LabelHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

const labelVariants = cva(
  "block peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      variant: {
        default: "text-sm font-medium text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface LabelProps 
  extends LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {
  requiredMark?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, variant, children, requiredMark, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(labelVariants({ variant }), className, "h-[20px]")}
        {...props} 
      >
        {children}
        {requiredMark && (
          <span className="ml-1 text-error">*</span>
        )}
      </label>
    );
  }
);

Label.displayName = "Label";