import React, { ReactNode } from "react";
import { cn } from "../../lib/utils";

export function renderActionCell(content: ReactNode, isMobile: boolean) {
  if (!React.isValidElement(content)) return content;

  if (isMobile) {
    // Mobile horizontal full-width buttons
    // We use CSS to force any interactive children (buttons, links) to fill the width
    return (
      <div 
        className={cn(
          "flex flex-row items-center gap-2 w-full",
          "[&_button]:flex-1 [&_button]:h-8 [&_button]:w-full [&_button]:px-2 [&_button]:rounded-button",
          "[&_a]:flex-1 [&_a]:w-full [&_a>button]:w-full [&_a>button]:h-8",
          "[&_button]:border [&_button]:bg-foreground/5 [&_button]:border-foreground/10"
        )}
      >
        {content}
      </div>
    );
  }

  // Desktop view: pill container
  return (
    <div 
      className="inline-flex items-center gap-0.5 p-0.5 bg-foreground/[0.03] border border-neo-bevel rounded-button flex-nowrap"
      onClick={(e) => e.stopPropagation()}
    >
      {content}
    </div>
  );
}
