import { forwardRef } from "react";
import type { LabelHTMLAttributes } from "react";
import { clsx } from "clsx";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  requiredMark?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, requiredMark, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={clsx(
          "block text-sm font-medium text-gray-700", // Màu chữ xám đậm, dễ đọc
          className
        )}
        {...props}
      >
        {children}
        {requiredMark && (
          <span className="ml-1 text-red-500">*</span> // Màu đỏ cho dấu * bắt buộc
        )}
      </label>
    );
  }
);

Label.displayName = "Label";