import { cva, type VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-button text-sm font-medium tracking-tight transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20 focus-visible:border-foreground/40 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-foreground text-background border border-transparent hover:bg-foreground/90 active:scale-[0.98]",
        destructive:
          "bg-error text-white border border-transparent hover:bg-error/90 active:scale-[0.98]",
        edit: "bg-surface text-foreground border border-transparent hover:bg-foreground/[0.04] active:scale-[0.98]",
        success:
          "bg-success text-white border border-transparent hover:bg-success/90 active:scale-[0.98]",
        outline:
          "border border-foreground/10 bg-transparent text-foreground hover:bg-foreground/[0.02] active:scale-[0.98]",
        secondary:
          "bg-background text-foreground border border-transparent hover:bg-foreground/[0.02] active:scale-[0.98]",
        ghost: "text-foreground hover:bg-foreground/[0.04] active:scale-[0.98]",
        link: "text-muted underline-offset-4 hover:underline",
      },
      size: {
        default: "h-8 px-2 py-2 text-sm",
        sm: "h-8 rounded-inner px-3 text-xs",
        lg: "h-12 rounded-button px-8 text-base",
        icon: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading,
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="mr-2 h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            {size !== "icon" && "Loading..."}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";
