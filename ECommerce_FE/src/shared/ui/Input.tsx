import { forwardRef, InputHTMLAttributes } from "react";
import { clsx } from "clsx";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={clsx(
          "w-full rounded-lg",
          "px-3 py-2",
          "outline-none transition",
          "bg-white/25", // Nền input trong suốt nhẹ
          "border-solid border-[1.5px]", // Định nghĩa kiểu và độ dày border chung

          // Định nghĩa màu border và focus ring mặc định
          // Sử dụng màu xám nhẹ cho border không lỗi
          error
            ? "border-red-400 focus:ring-red-200" // Khi có lỗi
            : "border-gray-300 focus:ring-blue-300", // Khi không có lỗi, dùng màu xanh nhạt hoặc màu primary của bạn

          // Màu placeholder, dùng gray-500 nếu brown-700 không được định nghĩa
          "placeholder:text-gray-500", // hoặc "placeholder:text-brown-700" nếu đã có màu brown

          // Các class bổ sung từ `className` prop được đặt cuối cùng để ghi đè
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";