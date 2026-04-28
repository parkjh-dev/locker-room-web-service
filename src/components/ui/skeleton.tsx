import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('relative overflow-hidden rounded-md bg-brand-50', className)} {...props}>
      <span aria-hidden="true" className="bg-shimmer absolute inset-0" />
    </div>
  );
}

export { Skeleton };
