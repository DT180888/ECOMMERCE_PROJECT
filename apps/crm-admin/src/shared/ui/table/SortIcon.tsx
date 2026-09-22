import { cn } from "../../lib/utils";
import type { SortDirection } from "./types";

export function SortIcon({
  direction,
  active,
}: {
  direction: SortDirection;
  active: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex flex-col gap-[2px] ml-1.5 transition-opacity duration-200",
        active ? "opacity-100" : "opacity-30"
      )}
      aria-hidden="true"
    >
      <svg width="7" height="5" viewBox="0 0 7 5" fill="none">
        <path
          d="M3.5 0L7 5H0L3.5 0Z"
          fill="currentColor"
          className={cn(
            "transition-colors",
            active && direction === "asc"
              ? "text-accent"
              : "text-muted-foreground"
          )}
        />
      </svg>
      <svg width="7" height="5" viewBox="0 0 7 5" fill="none">
        <path
          d="M3.5 5L0 0H7L3.5 5Z"
          fill="currentColor"
          className={cn(
            "transition-colors",
            active && direction === "desc"
              ? "text-accent"
              : "text-muted-foreground"
          )}
        />
      </svg>
    </span>
  );
}
