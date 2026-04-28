import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  children?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action, children }: EmptyStateProps) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-brand-200 bg-brand-50/30 p-10 text-center">
      {Icon && (
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-card text-brand-600 shadow-soft">
          <Icon className="h-6 w-6" />
        </span>
      )}
      <h3 className="text-base font-bold text-foreground">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">{description}</p>
      )}
      {action && (
        <Button variant="outline" size="sm" onClick={action.onClick} className="mt-2">
          {action.label}
        </Button>
      )}
      {children}
    </div>
  );
}
