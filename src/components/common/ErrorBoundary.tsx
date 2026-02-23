import { Component, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <DefaultErrorFallback error={this.state.error} onReset={this.handleReset} />
        )
      );
    }
    return this.props.children;
  }
}

// eslint-disable-next-line react-refresh/only-export-components
function DefaultErrorFallback({ error, onReset }: { error: Error | null; onReset: () => void }) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-8">
      <div className="text-4xl">⚠️</div>
      <h2 className="text-lg font-semibold text-foreground">문제가 발생했습니다</h2>
      <p className="max-w-md text-center text-sm text-muted-foreground">
        {error?.message || '알 수 없는 오류가 발생했습니다.'}
      </p>
      <Button variant="outline" onClick={onReset}>
        다시 시도
      </Button>
    </div>
  );
}
