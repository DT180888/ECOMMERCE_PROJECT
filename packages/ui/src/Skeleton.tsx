import { HTMLAttributes } from "react";
import { cn } from "./utils";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ className, style, width, height, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("bg-foreground/[0.06] rounded-inner animate-pulse", className)}
      style={{
        width,
        height,
        ...style,
      }}
      {...props}
    />
  );
}
