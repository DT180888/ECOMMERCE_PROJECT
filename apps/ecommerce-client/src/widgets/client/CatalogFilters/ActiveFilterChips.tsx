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

export default function ActiveFilterChips({ chips, onClearAll, className = "mb-6" }: ActiveFilterChipsProps) {
  if (chips.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 animate-in fade-in duration-200 ${className}`}>
      <span className="text-[11px] font-semibold text-muted uppercase tracking-wider mr-2 shrink-0">
        Đang lọc theo:
      </span>
      {chips.map(chip => (
        <button
          key={chip.key}
          onClick={chip.onClear}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-background shadow-neo-sm hover:shadow-neo-inset-sm text-xs font-medium text-foreground rounded-full transition-all duration-300 cursor-pointer"
        >
          {chip.label}
          <span className="text-muted font-bold hover:text-foreground text-[10px] ml-0.5">✕</span>
        </button>
      ))}
      <button
        onClick={onClearAll}
        className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors ml-2 uppercase tracking-wider cursor-pointer"
      >
        Xóa tất cả
      </button>
    </div>
  );
}
