import { forwardRef, TextareaHTMLAttributes } from "react";
import { clsx } from "clsx";

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={clsx(
          "w-full rounded-lg",
          "px-3 py-2",
          "outline-none transition",
          "bg-white/25", // Nhất quán với Input, PasswordInput, Select
          "border-solid border-[1.5px]", // Độ dày và kiểu border nhất quán

          error
            ? "border-red-400 focus:ring-red-200"
            : "border-gray-300 focus:ring-purple-300", // Màu border và focus ring nhất quán
          "placeholder:text-gray-500", // Màu placeholder nhất quán
          className
        )}
        rows={props.rows || 4} // Giữ nguyên mặc định 4 hàng
        {...props}
      />
    );
  }
);

TextArea.displayName = "TextArea";