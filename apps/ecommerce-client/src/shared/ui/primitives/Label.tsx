import { forwardRef } from "react";
import type { LabelHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../shared/utils";

const labelVariants = cva(
  "block select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      variant: {
        default: "text-[11px] font-display uppercase tracking-widest text-muted-foreground font-medium",
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
        className={cn(labelVariants({ variant }), className, "h-fit")}
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
