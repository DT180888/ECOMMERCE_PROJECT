import { HTMLAttributes, forwardRef, ElementType } from "react";
import { cn } from "./utils";

// ── Standard High-Fashion Editorial UI Container Cards ──
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
          "rounded-none transition-all duration-300 ease-out font-display m-0",
          variant === "flat" && "bg-card border-0 shadow-none",
          variant === "raised" && "bg-card border border-border/60 shadow-none",
          variant === "inset" && "bg-surface border border-border/40 shadow-none",
          variant === "inset-deep" && "bg-muted/30 border border-border/50 shadow-none",
          variant === "divider" && "bg-transparent border-0 shadow-none divide-y divide-border/50",
          hoverable && "hover:border-foreground/40 transition-colors duration-200 cursor-pointer",
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
      className={cn("flex flex-col space-y-1.5 p-6 sm:p-8", className)}
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
        "font-display text-base sm:text-lg font-medium leading-none tracking-tight text-foreground",
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
      className={cn("text-xs sm:text-sm text-muted-foreground font-display leading-relaxed", className)}
      {...props}
    />
  )
);
CardDescription.displayName = "CardDescription";

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 sm:p-8 pt-0 font-display", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-6 sm:p-8 pt-0 font-display", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

// Re-export EditorialProductCard for backward compatibility
export * from "./EditorialProductCard";
