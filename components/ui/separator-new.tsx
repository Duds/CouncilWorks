"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

interface SeparatorProps extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  className?: string;
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(({ className = "", orientation = "horizontal", decorative = true, ...props }, ref) => {
  // Build className deterministically
  const baseClasses = "shrink-0 bg-gray-200 dark:bg-gray-700";
  const orientationClasses = orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]";
  const finalClassName = [baseClasses, orientationClasses, className].filter(Boolean).join(" ");

  return (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={finalClassName}
      {...props}
    />
  );
});

Separator.displayName = "Separator";

export { Separator };
