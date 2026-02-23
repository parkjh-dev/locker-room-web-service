import { Skeleton } from '@/components/ui/skeleton';

interface SkeletonLoaderProps {
  type?: 'post-list' | 'post-detail' | 'card' | 'list';
  count?: number;
}

export function SkeletonLoader({ type = 'list', count = 3 }: SkeletonLoaderProps) {
  switch (type) {
    case 'post-list':
      return (
        <div className="space-y-4">
          {Array.from({ length: count }).map((_, i) => (
            <PostListSkeleton key={i} />
          ))}
        </div>
      );
    case 'post-detail':
      return <PostDetailSkeleton />;
    case 'card':
      return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: count }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      );
    case 'list':
    default:
      return (
        <div className="space-y-3">
          {Array.from({ length: count }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      );
  }
}

function PostListSkeleton() {
  return (
    <div className="space-y-2 rounded-lg border p-4">
      <Skeleton className="h-5 w-3/4" />
      <div className="flex items-center gap-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}

function PostDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-2/3" />
      <div className="flex items-center gap-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="space-y-3 rounded-lg border p-4">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}
