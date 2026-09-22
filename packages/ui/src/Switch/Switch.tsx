import React, { useId, forwardRef } from 'react';
import { cn } from '../utils';

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
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-border/40 transition-colors duration-300 ease-out",
          "peer-focus-visible:ring-1 peer-focus-visible:ring-foreground/20 peer-focus-visible:border-foreground/40",
          checked ? "bg-foreground border-transparent" : "bg-foreground/[0.04]",
          disabled && "cursor-not-allowed"
        )}
      >
        <span
          className={cn(
            "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-none transition-transform duration-300 ease-out",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </label>
    </div>
  );
});

Switch.displayName = "Switch";