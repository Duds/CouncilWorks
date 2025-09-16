import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const kbdVariants = cva(
  "inline-flex items-center justify-center rounded-md border bg-background px-2 py-1 font-mono text-sm font-medium shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-border bg-background text-foreground shadow-sm",
        outline: "border-border bg-background text-foreground shadow-sm",
        secondary: "border-border bg-secondary text-secondary-foreground shadow-sm",
        destructive: "border-destructive bg-destructive text-destructive-foreground shadow-sm",
        ghost: "border-transparent bg-transparent text-foreground shadow-none",
      },
      size: {
        default: "h-6 px-2 text-xs",
        sm: "h-5 px-1.5 text-[10px]",
        lg: "h-8 px-3 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface KbdProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof kbdVariants> {}

const Kbd = React.forwardRef<HTMLElement, KbdProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <kbd
        className={cn(kbdVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Kbd.displayName = "Kbd"

export { Kbd, kbdVariants }
