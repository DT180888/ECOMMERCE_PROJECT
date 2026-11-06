import React from "react";
import { cn, Skeleton } from "@my-project/ui";

export interface SkeletonCardProps {
  count?: number;
  className?: string;
  hasMedia?: boolean;
}

export function SkeletonCard({ count = 8, className, hasMedia = true }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-3 md:gap-3.5",
        className
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "p-3.5 md:p-4 rounded-[2px] border border-border/80 bg-card select-none flex transition-all duration-150 shadow-none min-w-0 overflow-hidden",
            hasMedia ? "flex-row gap-3 sm:gap-3.5" : "flex-col justify-between"
          )}
        >
          {/* Left Media Stage Skeleton */}
          {hasMedia && (
            <div className="w-24 sm:w-28 aspect-[3/4] shrink-0 rounded-[2px] bg-surface/80 overflow-hidden animate-pulse" />
          )}

          {/* Right Content Column Skeleton */}
          <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
            <div>
              {/* Top Header Row Skeleton: Title & Subtitle on Left, Action on Top-Right */}
              <div className="flex items-start justify-between gap-2.5 w-full min-w-0 mb-1.5">
                <div className="flex-1 min-w-0 space-y-1.5">
                  <Skeleton className="h-4 w-3/4 rounded-[2px]" />
                  <Skeleton className="h-3 w-1/3 rounded-[2px]" />
                </div>
                <Skeleton className="h-6 w-12 rounded-[2px] shrink-0 ml-auto" />
              </div>

              {/* RFM Specs Box Skeleton: Pure Spacing, Zero Internal Border */}
              <div className="p-2.5 rounded-[2px] bg-surface space-y-2 my-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-2.5 w-1/4 rounded-[2px]" />
                  <Skeleton className="h-2.5 w-1/3 rounded-[2px]" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-2.5 w-1/3 rounded-[2px]" />
                  <Skeleton className="h-2.5 w-1/4 rounded-[2px]" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-2.5 w-1/5 rounded-[2px]" />
                  <Skeleton className="h-2.5 w-2/5 rounded-[2px]" />
                </div>
              </div>
            </div>

            {/* Bottom Dock Skeleton: Pure Spacing, No border-t */}
            <div className="flex items-center justify-between gap-2 mt-auto pt-2.5">
              <Skeleton className="h-3.5 w-1/3 rounded-[2px]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
