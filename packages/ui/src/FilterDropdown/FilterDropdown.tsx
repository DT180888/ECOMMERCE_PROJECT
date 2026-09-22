import { useRef, useEffect, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Button } from "../Button";

export interface FilterDropdownOption {
  /** Unique key for this option */
  value: string;
  /** Display label */
  label: string;
  /**
   * Plain Tailwind text-color class for the active label in the trigger.
   * e.g. "text-amber-500"
   */
  activeColorClass?: string;
  /**
   * Tailwind bg-color class for the active item row + the dot indicator.
   * e.g. "bg-amber-500"
   */
  activeBgClass?: string;
  activeHoverTextClass?: string;
}

export interface FilterDropdownProps {
  options: FilterDropdownOption[];
  value: string;
  onSelect: (value: string) => void;
  /** Label prefix shown before the selected value in the trigger. e.g. "Trạng thái:" */
  placeholder?: string;
  /** Additional className on the root wrapper */
  className?: string;
}

export function FilterDropdown({
  options,
  value,
  onSelect,
  placeholder,
  className,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen]);

  const active = options.find((o) => o.value === value);

  return (
    <div ref={containerRef} className={`relative${className ? ` ${className}` : ""}`}>
      {/* Trigger */}
      <Button
        variant="secondary"
        size="default"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-2 h-8 px-3 text-sm font-medium ${
          active?.activeBgClass || ""
        } `}
      >
        <span className="flex items-center gap-2 min-w-0">
          {/* Colored dot matching active status */}
          {active?.activeBgClass && (
            <span
              className={`shrink-0 w-2 h-2 rounded-full ${active.activeBgClass}`}
            />
          )}
          {placeholder && (
            <span className="text-muted-foreground font-medium shrink-0">{placeholder}</span>
          )}
          <span className="text-foreground text-xs md:text-sm">
            {active?.label ?? ""}
          </span>
        </span>
        <ChevronDownIcon
          className={`w-3 h-3 md:w-4 md:h-4 text-muted-foreground transition-transform duration-300 shrink-0${
            isOpen ? " rotate-180" : ""
          }`}
        />
      </Button>

      {/* Dropdown list */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute top-full left-0 right-0 md:right-auto md:min-w-[200px] mt-1.5 z-30 bg-card rounded-inner border border-foreground/5 shadow-neo p-1.5 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-200"
        >
          {options.map((option) => {
            const isActive = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => {
                  onSelect(option.value);
                  setIsOpen(false);
                }}
                className={
                  isActive
                    ? `w-full text-left h-8 px-2 text-xs font-medium border-none rounded-[4px] transition-all duration-200 ${option.activeBgClass || "bg-foreground"} ${option.activeColorClass || "text-background"}`
                    : `w-full text-left h-8 px-2 text-xs font-medium border-none rounded-[4px] transition-all duration-200 text-foreground hover:bg-foreground/[0.04] ${option.activeHoverTextClass || ""}`
                }
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
