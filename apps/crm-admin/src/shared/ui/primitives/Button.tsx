import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../shared/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-sm text-[13px] font-sans font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary disabled:pointer-events-none disabled:opacity-40 select-none cursor-pointer touch-manipulation",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border border-transparent hover:bg-primary-hover active:opacity-90 shadow-sm",
        primary:
          "bg-primary text-primary-foreground border border-transparent hover:bg-primary-hover active:opacity-90 shadow-sm",
        secondary:
          "bg-surface text-foreground border border-border hover:bg-surface-hover hover:border-border-strong active:bg-surface-tertiary shadow-sm",
        outline:
          "bg-transparent text-foreground border border-border hover:bg-surface-hover/80 hover:border-border-strong active:bg-surface-tertiary shadow-none",
        ghost:
          "bg-transparent text-muted-foreground hover:text-foreground hover:bg-surface-hover active:bg-surface-tertiary border-0 shadow-none",
        destructive:
          "bg-error/10 text-error border border-error/20 hover:bg-error/20 active:bg-error/25 shadow-none",
        edit:
          "bg-surface text-foreground border border-border hover:bg-surface-hover active:bg-surface-tertiary shadow-sm",
        success:
          "bg-success/10 text-success border border-success/30 hover:bg-success/20 active:opacity-90 shadow-none",
        link:
          "text-primary underline-offset-4 hover:underline p-0 h-auto font-normal normal-case border-0 bg-transparent shadow-none",
      },
      size: {
        default: "h-9 sm:h-[34px] px-3.5 text-xs sm:text-[13px] gap-2",
        md: "h-9 sm:h-[34px] px-3.5 text-xs sm:text-[13px] gap-2",
        xs: "h-7 sm:h-6 px-2 text-xs sm:text-[11px] gap-1 relative after:absolute after:-inset-1.5 sm:after:hidden after:content-['']",
        sm: "h-8 sm:h-7 px-2.5 text-xs gap-1.5 relative after:absolute after:-inset-1 sm:after:hidden after:content-['']",
        lg: "h-11 sm:h-10 px-5 text-sm gap-2.5",
        icon: "h-9 w-9 sm:h-[34px] sm:w-[34px] p-0 shrink-0",
        "icon-sm": "h-8 w-8 sm:h-7 sm:w-7 p-0 shrink-0 relative after:absolute after:-inset-1 sm:after:hidden after:content-['']",
        "icon-xs": "h-7 w-7 sm:h-6 sm:w-6 p-0 shrink-0 relative after:absolute after:-inset-1.5 sm:after:hidden after:content-['']",
        "icon-lg": "h-11 w-11 sm:h-10 sm:w-10 p-0 shrink-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  /**
   * Automatically collapses text label on mobile screens (< sm / 640px)
   * while keeping the icon visible to preserve compact horizontal space.
   */
  collapseTextOnSm?: boolean;
  /**
   * Expands button to full width on mobile screens (< sm / 640px)
   * (e.g. for modal, drawer, or bottom action sheets).
   */
  fullWidthOnSm?: boolean;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      loadingText,
      icon,
      collapseTextOnSm = false,
      fullWidthOnSm = false,
      asChild = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isInteractiveDisabled = isLoading || disabled;

    if (asChild) {
      return (
        <Slot
          ref={ref}
          className={cn(
            buttonVariants({ variant, size }),
            fullWidthOnSm && "w-full sm:w-auto",
            className
          )}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    return (
      <button
        ref={ref}
        disabled={isInteractiveDisabled}
        className={cn(
          buttonVariants({ variant, size }),
          fullWidthOnSm && "w-full sm:w-auto",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-3.5 w-3.5 text-current shrink-0"
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
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {loadingText && <span>{loadingText}</span>}
          </span>
        ) : (
          <>
            {icon && <span className="shrink-0">{icon}</span>}
            {children && (
              <span className={cn(collapseTextOnSm && "hidden sm:inline")}>
                {children}
              </span>
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
