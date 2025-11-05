import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot"; // Import Slot từ Radix UI

// --- 1. Định nghĩa class Tailwind cho từng kiểu nút ---
const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium rounded-lg focus:outline-none transition-colors disabled:opacity-60 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400",
        danger: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700",
        outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100",
        ghost: "text-gray-600 hover:bg-gray-100 active:bg-gray-200",
        glass: "bg-white/25 text-white hover:bg-white/35 active:bg-white/45", // Variant glassmorphism
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

// --- 2. Định nghĩa kiểu props cho Button ---
export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  asChild?: boolean; // Thêm prop asChild
}

// --- 3. Component Button chính ---
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, asChild, children, ...props }, ref) => {
    // Quyết định render thẻ nào: Slot nếu asChild là true, ngược lại là "button"
    const Comp = asChild ? Slot : "button"; 

    return (
      <Comp
        ref={ref}
        className={clsx(buttonVariants({ variant, size }), className)}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            Đang xử lý...
          </span>
        ) : (
          children
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";