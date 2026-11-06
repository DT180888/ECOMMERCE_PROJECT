import React from "react";
import { X, ArrowCounterClockwise } from "@phosphor-icons/react";
import { Button, Badge } from "@my-project/ui";

export interface FilterChip {
  key: string;
  label: string;
  onClear: () => void;
}

interface ActiveFilterChipsProps {
  chips: FilterChip[];
  onClearAll: () => void;
  className?: string;
}

/**
 * ActiveFilterChips Component (Hairline Studio Edition)
 * 
 * Hiển thị các tiêu chí đang được chọn dưới dạng Hairline Studio Pills:
 * - Chuẩn hóa bằng Badge và Button từ @my-project/ui.
 * - Triệt tiêu 100% Neumorphism (shadow-none).
 * - Phẳng 100%, viền 1px border-border/60, góc micro rounded-[2px].
 */
export default function ActiveFilterChips({ chips, onClearAll, className = "" }: ActiveFilterChipsProps) {
  if (chips.length === 0) return null;

  return (
    <div className={`flex items-center gap-2 select-none overflow-x-auto scrollbar-none ${className}`}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onClearAll}
        className="h-7 px-2 text-[11px] gap-1 shrink-0 rounded-[2px] sticky"
      >
        <ArrowCounterClockwise className="w-3 h-3 stroke-[1.25]" weight="light" />
        <span>Xóa Tất Cả</span>
      </Button>

      {chips.map((chip) => (
        <Badge
          key={chip.key}
          variant="flat"
          onClick={chip.onClear}
          className="h-7 px-2.5 gap-1.5 cursor-pointer hover:border-foreground/60 transition-colors shrink-0 normal-case font-normal text-xs text-foreground group"
        >
          <span className="truncate max-w-[200px]">{chip.label}</span>
          <X className="w-3 h-3 text-muted-foreground group-hover:text-foreground stroke-[1.5] transition-colors shrink-0" weight="light" />
        </Badge>
      ))}
    </div>
  );
}
