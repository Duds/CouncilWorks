import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // Priority variants
        "priority-low":
          "border-transparent bg-priority-low text-priority-low-foreground hover:bg-priority-low/80",
        "priority-medium":
          "border-transparent bg-priority-medium text-priority-medium-foreground hover:bg-priority-medium/80",
        "priority-high":
          "border-transparent bg-priority-high text-priority-high-foreground hover:bg-priority-high/80",
        "priority-critical":
          "border-transparent bg-priority-critical text-priority-critical-foreground hover:bg-priority-critical/80",
        // Condition variants
        "condition-excellent":
          "border-transparent bg-condition-excellent text-condition-excellent-foreground hover:bg-condition-excellent/80",
        "condition-good":
          "border-transparent bg-condition-good text-condition-good-foreground hover:bg-condition-good/80",
        "condition-fair":
          "border-transparent bg-condition-fair text-condition-fair-foreground hover:bg-condition-fair/80",
        "condition-poor":
          "border-transparent bg-condition-poor text-condition-poor-foreground hover:bg-condition-poor/80",
        "condition-critical":
          "border-transparent bg-condition-critical text-condition-critical-foreground hover:bg-condition-critical/80",
        "condition-unknown":
          "border-transparent bg-condition-unknown text-condition-unknown-foreground hover:bg-condition-unknown/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
