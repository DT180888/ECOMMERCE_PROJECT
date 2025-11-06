import * as React from "react";
import { forwardRef, SelectHTMLAttributes } from "react";
import { clsx } from "clsx";

export type SelectOption = { label: string; value: string | number };

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  /** Nếu truyền, component sẽ tự render <option> thay vì dùng children */
  options?: SelectOption[];
  /** Sugar callback trả ra value, ngoài onChange native */
  onValueChange?: (value: string) => void;
  /** Render option đầu tiên kiểu placeholder (disabled) khi dùng `options` */
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      error,
      children,
      options,
      onChange,
      onValueChange,
      placeholder,
      ...props
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e);
      onValueChange?.(e.target.value);
    };

    const hasOptions = Array.isArray(options) && options.length > 0;

    return (
      <select
        ref={ref}
        onChange={handleChange}
        className={clsx(
          "w-full rounded-lg",
          "px-3 py-2",
          "outline-none transition",
          "bg-white/25",
          "border-solid border-[1.5px]",
          error ? "border-red-400 focus:ring-red-200"
                : "border-gray-300 focus:ring-purple-300",
          className
        )}
        {...props}
      >
        {hasOptions ? (
          <>
            {placeholder !== undefined && (
              <option value="" disabled={true} hidden={true}>
                {placeholder}
              </option>
            )}
            {options!.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </>
        ) : (
          children
        )}
      </select>
    );
  }
);

Select.displayName = "Select";
export default Select;
