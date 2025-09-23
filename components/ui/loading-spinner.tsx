import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  /**
   * Size of the spinner
   * @default "default"
   */
  size?: 'sm' | 'default' | 'lg';

  /**
   * Custom className for styling
   */
  className?: string;

  /**
   * Loading text to display below the spinner
   */
  text?: string;

  /**
   * Whether to center the spinner
   * @default true
   */
  centered?: boolean;

  /**
   * Whether to show the spinner inline (no centering)
   * @default false
   */
  inline?: boolean;
}

/**
 * Standardized loading spinner component
 * Provides consistent loading states across the application
 *
 * @component LoadingSpinner
 * @example
 * ```tsx
 * <LoadingSpinner size="lg" text="Loading assets..." />
 * <LoadingSpinner size="sm" inline />
 * ```
 * @accessibility
 * - ARIA role: status
 * - Screen reader: Announces loading state
 */
export function LoadingSpinner({
  size = 'default',
  className,
  text,
  centered = true,
  inline = false
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const spinner = (
    <Loader2
      className={cn(
        'animate-spin',
        sizeClasses[size],
        className
      )}
      aria-hidden="true"
    />
  );

  if (inline) {
    return (
      <span className="inline-flex items-center" role="status" aria-label="Loading">
        {spinner}
        {text && <span className="ml-2 text-sm">{text}</span>}
      </span>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        centered && 'mx-auto',
        text && 'space-y-2'
      )}
      role="status"
      aria-label={text || 'Loading'}
    >
      {spinner}
      {text && (
        <p className="text-sm text-muted-foreground">
          {text}
        </p>
      )}
    </div>
  );
}
