import { cn, Skeleton } from "@my-project/ui";

export function SkeletonRow({
  colCount,
  withCheckbox,
}: {
  colCount: number;
  withCheckbox: boolean;
}) {
  return (
    <tr aria-hidden="true">
      {withCheckbox && (
        <td className="py-2.5 px-3 w-10">
          <Skeleton className="h-4 w-4 mx-auto rounded-[2px]" />
        </td>
      )}
      {Array.from({ length: colCount }).map((_, i) => (
        <td key={i} className="py-2.5 px-3">
          <Skeleton
            className={cn(
              "h-3.5 rounded-[2px]",
              i === 0 ? "w-3/4" : i === colCount - 1 ? "w-1/3 ml-auto" : "w-1/2"
            )}
          />
        </td>
      ))}
    </tr>
  );
}
