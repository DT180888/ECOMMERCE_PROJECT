// src/shared/ui/FormField.tsx
import { ReactNode } from "react";
import { Label } from "./Label";
import { clsx } from "clsx";

export interface FormFieldProps {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  helperText?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({
  label,
  htmlFor,
  required,
  helperText,
  error,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={clsx("space-y-1.5", className)}>
      {label && (
        <Label htmlFor={htmlFor} requiredMark={required}>
          {label}
        </Label>
      )}
      {children}
      {helperText && !error && <p className="text-xs text-gray-500">{helperText}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
