import { InputHTMLAttributes, forwardRef, useId } from "react";
import { cn } from "./utils";

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: boolean;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, error, disabled, ...props }, ref) => {
    const id = useId();
    const inputId = props.id || id;

    return (
      <div className={cn("flex items-center space-x-3 cursor-pointer select-none", disabled && "opacity-50 cursor-not-allowed")}>
        <div className="relative flex items-center justify-center">
          <input
            {...props}
            type="radio"
            ref={ref}
            id={inputId}
            disabled={disabled}
            className="peer sr-only"
          />
          {/* Custom track / outer ring */}
          <div
            className={cn(
              "h-5 w-5 rounded-full border border-border/40 bg-foreground/[0.02] transition-colors duration-300 ease-out hover:border-foreground/40",
              "peer-focus:ring-1 peer-focus:ring-foreground/20 peer-focus:ring-offset-2 peer-focus:ring-offset-background",
              error && "ring-2 ring-error border-error",
              "cursor-pointer"
            )}
          />
          {/* Custom inner dot indicator */}
          <div
            className={cn(
              "absolute h-2.5 w-2.5 rounded-full bg-foreground",
              "scale-0 transition-transform duration-300 ease-out",
              "peer-checked:scale-100",
              "pointer-events-none"
            )}
          />
        </div>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "text-sm font-medium text-foreground cursor-pointer",
              disabled && "cursor-not-allowed"
            )}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Radio.displayName = "Radio";
