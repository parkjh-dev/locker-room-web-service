import { Loader2 } from 'lucide-react';

interface FullScreenLoaderProps {
  message?: string;
}

export function FullScreenLoader({ message = '로딩 중...' }: FullScreenLoaderProps) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
