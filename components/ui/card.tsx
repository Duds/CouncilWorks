import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("rounded-lg bg-white", className)} {...props} />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-xl font-semibold leading-none tracking-tight", className)} {...props} />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };

// NestedCard: neutral surface with optional accent indicator
// Variants: "left-border" (A) and "top-bar" (B)
interface NestedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  accentClassName?: string; // e.g., "border-emerald-500/60" or "bg-emerald-500/70"
  variant?: "left-border" | "top-bar";
}

export const NestedCard = React.forwardRef<HTMLDivElement, NestedCardProps>(
  ({ className, accentClassName = "border-emerald-500/60", variant = "left-border", children, ...props }, ref) => {
    if (variant === "top-bar") {
      return (
        <div className={cn("relative", className)} ref={ref} {...props}>
          <div className={cn("absolute inset-x-0 top-0 h-1 rounded-t", accentClassName)} />
          <div className="rounded-lg bg-white border border-border">
            {children}
          </div>
        </div>
      );
    }
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg bg-white border border-border",
          "border-l-2",
          accentClassName,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
NestedCard.displayName = "NestedCard";
