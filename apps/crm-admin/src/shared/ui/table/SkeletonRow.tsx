import { cn } from "../../lib/utils";

export function SkeletonRow({
  colCount,
  withCheckbox,
}: {
  colCount: number;
  withCheckbox: boolean;
}) {
  return (
    <tr className="animate-pulse" aria-hidden="true">
      {withCheckbox && (
        <td className="px-4 py-3.5 md:py-5 md:px-6 w-10">
          <div className="h-4 w-4 rounded-inner bg-foreground/8 mx-auto" />
        </td>
      )}
      {Array.from({ length: colCount }).map((_, i) => (
        <td key={i} className="px-4 py-3.5 md:py-5 md:px-6">
          <div
            className={cn(
              "h-4 rounded-inner bg-foreground/8",
              i === 0 ? "w-3/4" : i === colCount - 1 ? "w-1/3 ml-auto" : "w-1/2"
            )}
          />
        </td>
      ))}
    </tr>
  );
}
