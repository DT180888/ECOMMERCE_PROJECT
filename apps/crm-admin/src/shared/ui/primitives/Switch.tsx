import React, { useId, forwardRef } from 'react';
import { cn } from "../shared/utils";

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(({
  checked,
  onCheckedChange,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  const uniqueId = useId(); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onCheckedChange(e.target.checked);
    }
  };

  return (
    <div className={cn("relative inline-flex items-center", disabled && "opacity-50 cursor-not-allowed", className)}>
      <input
        ref={ref}
        id={uniqueId}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className="peer sr-only"
        {...props}
      />
      <label 
        htmlFor={uniqueId}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-border/60 transition-colors duration-200",
          "peer-focus-visible:outline-none peer-focus-visible:ring-1 peer-focus-visible:ring-foreground",
          checked ? "bg-foreground border-foreground" : "bg-surface/50",
          disabled && "cursor-not-allowed"
        )}
      >
        <span
          className={cn(
            "pointer-events-none block h-3.5 w-3.5 rounded-full bg-background transition-transform duration-200",
            checked ? "translate-x-4.5" : "translate-x-0.5"
          )}
        />
      </label>
    </div>
  );
});

Switch.displayName = "Switch";
