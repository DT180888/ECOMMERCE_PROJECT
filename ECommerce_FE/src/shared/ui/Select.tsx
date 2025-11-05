import { forwardRef, SelectHTMLAttributes } from "react";
import { clsx } from "clsx";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={clsx(
          "w-full rounded-lg",
          "px-3 py-2",
          "outline-none transition",
          "bg-white/25", // Giữ nhất quán với Input và PasswordInput
          "border-solid border-[1.5px]", // Độ dày và kiểu border nhất quán

          error
            ? "border-red-400 focus:ring-red-200"
            : "border-gray-300 focus:ring-purple-300", // Màu border và focus ring nhất quán
          className
        )}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = "Select";