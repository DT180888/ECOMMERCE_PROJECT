import { useState, useRef, useEffect } from "react";
import { Button, Input, Tabs, TabsList, TabsTrigger, cn } from "@my-project/ui";
import { CalendarIcon, XMarkIcon } from "@heroicons/react/24/outline";

export type PresetKey = "today" | "7d" | "30d" | "this_month" | "custom";

export interface DateFilterValue {
  preset: PresetKey;
  from?: string; // ISO 8601 UTC
  to?: string;   // ISO 8601 UTC
  displayLabel: string;
}

interface DashboardDateFilterProps {
  value: DateFilterValue;
  onChange: (val: DateFilterValue) => void;
}

function parseLocalDate(dateStr: string, isEnd = false): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(
    year,
    month - 1,
    day,
    isEnd ? 23 : 0,
    isEnd ? 59 : 0,
    isEnd ? 59 : 0,
    isEnd ? 999 : 0
  );
}

function toLocalDateInputValue(isoString?: string): string {
  if (!isoString) return "";
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function calculateRange(
  preset: PresetKey,
  customFrom?: string,
  customTo?: string
): { from: string; to: string; label: string } {
  const now = new Date();

  if (preset === "today") {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    return { from: start.toISOString(), to: end.toISOString(), label: "Hôm nay" };
  }

  if (preset === "7d") {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6, 0, 0, 0, 0);
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    return { from: start.toISOString(), to: end.toISOString(), label: "7 ngày qua" };
  }

  if (preset === "30d") {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29, 0, 0, 0, 0);
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    return { from: start.toISOString(), to: end.toISOString(), label: "30 ngày qua" };
  }

  if (preset === "this_month") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    return { from: start.toISOString(), to: end.toISOString(), label: "Tháng này" };
  }

  // Custom
  const validFrom = customFrom || toLocalDateInputValue(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29).toISOString());
  const validTo = customTo || toLocalDateInputValue(now.toISOString());

  let fromDate = parseLocalDate(validFrom, false);
  let toDate = parseLocalDate(validTo, true);

  if (fromDate.getTime() > toDate.getTime()) {
    const temp = fromDate;
    fromDate = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate(), 0, 0, 0, 0);
    toDate = new Date(temp.getFullYear(), temp.getMonth(), temp.getDate(), 23, 59, 59, 999);
  }

  return {
    from: fromDate.toISOString(),
    to: toDate.toISOString(),
    label: `${fromDate.toLocaleDateString("vi-VN")} - ${toDate.toLocaleDateString("vi-VN")}`,
  };
}

export function DashboardDateFilter({ value, onChange }: DashboardDateFilterProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [customStart, setCustomStart] = useState(() => toLocalDateInputValue(value.from));
  const [customEnd, setCustomEnd] = useState(() => toLocalDateInputValue(value.to));
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync internal custom input fields when value prop changes
  useEffect(() => {
    if (value.from) setCustomStart(toLocalDateInputValue(value.from));
    if (value.to) setCustomEnd(toLocalDateInputValue(value.to));
  }, [value.from, value.to]);

  // Click outside listener for popover
  useEffect(() => {
    if (!isPopoverOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsPopoverOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isPopoverOpen]);

  const handleSelectPreset = (preset: PresetKey) => {
    if (preset === "custom") {
      setIsPopoverOpen((prev) => !prev);
      return;
    }
    setIsPopoverOpen(false);
    const resolved = calculateRange(preset);
    onChange({
      preset,
      from: resolved.from,
      to: resolved.to,
      displayLabel: resolved.label,
    });
  };

  const handleApplyCustom = () => {
    if (!customStart || !customEnd) return;
    const resolved = calculateRange("custom", customStart, customEnd);
    setIsPopoverOpen(false);
    onChange({
      preset: "custom",
      from: resolved.from,
      to: resolved.to,
      displayLabel: resolved.label,
    });
  };

  return (
    <div ref={containerRef} className="relative items-center w-full">
      {/* ── Official Segmented Tabs Component (Auto-collapses to dropdown on mobile) ── */}
      <Tabs
        value={value.preset}
        onValueChange={(val) => handleSelectPreset(val as PresetKey)}
        variant="line"
        size="md"
      >
        <TabsList mode="auto" size="sm">
          <TabsTrigger
            value="custom"
            icon={<CalendarIcon className="w-3.5 h-3.5 stroke-[1.75]" />}
            onClick={() => {
              if (value.preset === "custom") {
                setIsPopoverOpen((prev) => !prev);
              }
            }}
          >
            <span>{value.displayLabel}</span>
          </TabsTrigger>
          <TabsTrigger value="today">Hôm nay</TabsTrigger>
          <TabsTrigger value="7d">7 ngày</TabsTrigger>
          <TabsTrigger value="30d">30 ngày</TabsTrigger>
          <TabsTrigger value="this_month">Tháng này</TabsTrigger>
          
        </TabsList>
      </Tabs>

      {/* ── Micro Popover Custom Date ── */}
      {isPopoverOpen && (
        <>
          {/* Mobile backdrop */}
          <div
            className="fixed inset-0 bg-background/60 backdrop-blur-xs z-40 sm:hidden"
            onClick={() => setIsPopoverOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-x-4 top-24 sm:absolute sm:inset-x-auto sm:left-0 sm:top-full sm:mt-2 z-50 w-auto sm:w-72 bg-surface border border-border rounded-lg p-3.5 shadow-elevation-2 animate-in fade-in zoom-in-95 duration-150 font-sans">
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-border">
              <span className="text-xs font-semibold text-foreground">
                Khoảng thời gian tùy chỉnh
              </span>
              <button
                type="button"
                onClick={() => setIsPopoverOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-surface-hover transition-colors"
                aria-label="Đóng"
              >
                <XMarkIcon className="w-3.5 h-3.5 stroke-[1.75]" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Từ ngày
                </label>
                <Input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="h-8 text-xs bg-card border-border rounded-md w-full"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Đến ngày
                </label>
                <Input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="h-8 text-xs bg-card border-border rounded-md w-full"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => setIsPopoverOpen(false)}
                  className="h-7 px-2.5 text-xs rounded-md"
                >
                  Hủy
                </Button>
                <Button
                  variant="default"
                  size="xs"
                  onClick={handleApplyCustom}
                  disabled={!customStart || !customEnd}
                  className="h-7 px-3 text-xs rounded-md shadow-sm"
                >
                  Áp dụng
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardDateFilter;
