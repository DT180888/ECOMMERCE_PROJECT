import { HTMLAttributes } from "react";
import { cn } from "../shared/utils";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ className, style, width, height, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("bg-surface/60 rounded-[2px] animate-pulse", className)}
      style={{
        width,
        height,
        ...style,
      }}
      {...props}
    />
  );
}
