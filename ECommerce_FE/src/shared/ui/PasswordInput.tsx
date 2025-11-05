import { useState, forwardRef, InputHTMLAttributes } from "react";
import { clsx } from "clsx";

export interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, error, ...props }, ref) => {
    const [show, setShow] = useState(false);
    return (
      <div className="relative">
        <input
          ref={ref}
          type={show ? "text" : "password"}
          className={clsx(
            "w-full rounded-lg",
            "px-3 py-2 pr-10",
            "outline-none transition",
            "bg-white/25",
            "border-solid border-[1.5px]",
            error
              ? "border-red-400 focus:ring-red-200"
              : "border-gray-300 focus:ring-purple-300", // Hoặc một màu primary phù hợp khác
            "placeholder:text-gray-500", // Màu placeholder đậm hơn một chút
            className
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-purple-500" // Màu chữ rõ ràng hơn, có hover
          aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        >
          {show ? "Ẩn" : "Hiện"}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";