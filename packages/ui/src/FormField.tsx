import { ReactNode } from "react";
import { Label } from "./Label";
import { cn } from "./utils";

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
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <Label 
          htmlFor={htmlFor} 
          requiredMark={required}
          // Thêm màu chữ sáng cho Label để nổi bật trên nền tối (đã đổi sang text-foreground cho light theme)
          className="text-foreground font-medium"
        >
          {label}
        </Label>
      )}
      {children}
      
      {/* Helper text màu xám */}
      {helperText && !error && <p className="text-xs text-muted-foreground">{helperText}</p>}
      
      {/* Error text */}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}