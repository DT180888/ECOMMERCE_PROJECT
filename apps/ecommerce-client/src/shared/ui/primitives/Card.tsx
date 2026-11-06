import { HTMLAttributes, forwardRef, ElementType } from "react";
import { cn } from "../shared/utils";

// ── Standard Fluent Blue UI Container Cards ──
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "flat" | "raised" | "inset" | "inset-deep" | "divider";
  hoverable?: boolean;
  as?: ElementType;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "raised", hoverable = false, as: Component = "div", ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          "rounded-lg transition-all duration-200 ease-out font-sans m-0",
          variant === "flat" && "bg-card border-0 shadow-none",
          variant === "raised" && "bg-card border border-border shadow-card",
          variant === "inset" && "bg-surface border border-border-subtle shadow-none",
          variant === "inset-deep" && "bg-surface-tertiary border border-border-subtle shadow-none",
          variant === "divider" && "bg-transparent border-0 shadow-none divide-y divide-border",
          hoverable && "hover:border-primary/50 hover:shadow-elevation-2 transition-all duration-200 cursor-pointer",
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-5 sm:p-6 pb-3 sm:pb-4", className)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "font-sans text-base font-semibold leading-none tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-xs sm:text-[13px] text-muted-foreground font-sans leading-relaxed", className)}
      {...props}
    />
  )
);
CardDescription.displayName = "CardDescription";

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-5 sm:p-6 pt-0 font-sans", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-5 sm:p-6 pt-0 font-sans", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

// Re-export EditorialProductCard for backward compatibility
export * from "../client/EditorialProductCard";
