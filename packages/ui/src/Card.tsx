import { HTMLAttributes, forwardRef, ElementType } from "react";
import { cn } from "./utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "flat" | "raised" | "inset" | "inset-deep";
  hoverable?: boolean;
  as?: ElementType;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "raised", hoverable = false, as: Component = "div", ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          "rounded-card bg-card border border-border/40 transition-all duration-300 ease-out",
          // Elevation states (Flat minimalist)
          variant === "flat" && "shadow-none border-transparent",
          variant === "raised" && "shadow-sm",
          
          // Hover interactions
          hoverable && variant === "raised" && "hover:shadow-md hover:-translate-y-0.5 cursor-pointer",
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
      className={cn("flex flex-col space-y-1.5 responsive-card-padding", className)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("font-display text-lg font-bold leading-none tracking-tight text-foreground", className)}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-muted", className)}
      {...props}
    />
  )
);
CardDescription.displayName = "CardDescription";

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("responsive-card-padding pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center responsive-card-padding pt-0", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";
