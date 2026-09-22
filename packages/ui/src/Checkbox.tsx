import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "./utils";

// 1. Định nghĩa Props
// Mở rộng InputHTMLAttributes cho loại HTMLInputElement
// và thêm prop 'error' tùy chọn.
export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

// 2. Định nghĩa Component sử dụng forwardRef
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        // Quan trọng: Phải là type="checkbox"
        type="checkbox"
        ref={ref}
        className={cn(
          // Kích thước chuẩn cho checkbox
          "h-5 w-5",
          // Thiết lập viền và nền (Flat)
          "border border-border/40 bg-foreground/[0.02] text-foreground rounded-inner",
          // Hover state
          "hover:border-foreground/40",
          // Trạng thái Checked
          "checked:bg-foreground checked:border-foreground checked:shadow-none",
          // Hiệu ứng focus & cursor
          "focus:ring-1 focus:ring-foreground/20 focus:ring-offset-2 focus:ring-offset-background",
          "cursor-pointer transition-all duration-300 ease-out",
          // Thêm style cho trạng thái lỗi (nếu có)
          error && "ring-2 ring-error checked:bg-error border-error",
          // Props className từ bên ngoài
          className
        )}
        {...props}
      />
    );
  }
);

// 3. Đặt DisplayName
Checkbox.displayName = "Checkbox";