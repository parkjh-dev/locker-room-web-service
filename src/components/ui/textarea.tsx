import * as React from 'react';

import { cn } from '@/lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[88px] w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-base shadow-xs transition-[box-shadow,border-color,background-color] placeholder:text-muted-foreground hover:border-brand-200 focus-visible:border-brand-500 focus-visible:bg-card focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/15 aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:ring-destructive/20 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
