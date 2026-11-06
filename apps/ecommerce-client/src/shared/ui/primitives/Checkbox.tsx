import React, { forwardRef, InputHTMLAttributes, useEffect, useRef, useCallback } from "react";
import { cn } from "../shared/utils";

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  indeterminate?: boolean;
  indicatorClassName?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      error,
      indeterminate,
      indicatorClassName,
      disabled,
      ...props
    },
    forwardedRef
  ) => {
    const innerRef = useRef<HTMLInputElement | null>(null);

    // Sync indeterminate DOM property
    useEffect(() => {
      const el = innerRef.current;
      if (el && typeof indeterminate === "boolean") {
        el.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    // Handle forwardedRef while retaining internal ref
    const setRef = useCallback(
      (node: HTMLInputElement | null) => {
        innerRef.current = node;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          (forwardedRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
        }
      },
      [forwardedRef]
    );

    return (
      <span
        className={cn(
          "relative inline-flex items-center justify-center h-4 w-4 shrink-0 select-none align-middle rounded-sm cursor-pointer after:absolute after:-inset-2 sm:after:hidden after:content-[''] touch-manipulation",
          "border border-border bg-card transition-all duration-150",
          "hover:border-primary/60",
          "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary/20 has-[:focus-visible]:ring-offset-1 has-[:focus-visible]:ring-offset-background",
          "has-[:checked]:bg-primary has-[:checked]:border-primary",
          "has-[:indeterminate]:bg-primary has-[:indeterminate]:border-primary",
          "has-[:disabled]:opacity-40 has-[:disabled]:cursor-not-allowed",
          error && "border-error has-[:checked]:bg-error has-[:checked]:border-error",
          className
        )}
      >
        <input
          type="checkbox"
          ref={setRef}
          disabled={disabled}
          className="peer absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 m-0 disabled:cursor-not-allowed"
          {...props}
        />
        <svg
          className={cn(
            "pointer-events-none w-3 h-3 stroke-[2.2] stroke-current transition-opacity duration-150",
            "text-primary-foreground opacity-0",
            "peer-checked:opacity-100 peer-indeterminate:opacity-0",
            indicatorClassName
          )}
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3.5 8.5L6.5 11.5L12.5 4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span
          className={cn(
            "checkbox-dash pointer-events-none absolute w-2 h-0.5 bg-current rounded-full transition-opacity duration-150",
            "text-primary-foreground opacity-0",
            "peer-indeterminate:opacity-100",
            indicatorClassName
          )}
          aria-hidden="true"
        />
      </span>
    );
  }
);

Checkbox.displayName = "Checkbox";
