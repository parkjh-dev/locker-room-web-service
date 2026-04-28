import { useEffect } from 'react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useThemeStore, applyTheme, type ThemeMode } from '@/stores/themeStore';

const OPTIONS: { mode: ThemeMode; label: string; icon: typeof Sun }[] = [
  { mode: 'light', label: '라이트', icon: Sun },
  { mode: 'dark', label: '다크', icon: Moon },
  { mode: 'system', label: '시스템', icon: Monitor },
];

export function ThemeToggle() {
  const { mode, setMode } = useThemeStore();

  // mode가 system일 때 OS 변경에 반응
  useEffect(() => {
    if (mode !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme('system');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [mode]);

  const isDarkResolved =
    mode === 'dark' ||
    (mode === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`테마 변경 (현재: ${mode})`}
          className="relative"
        >
          <Sun
            className={`h-4 w-4 transition-all ${
              isDarkResolved ? '-rotate-90 scale-0' : 'rotate-0 scale-100'
            }`}
          />
          <Moon
            className={`absolute h-4 w-4 transition-all ${
              isDarkResolved ? 'rotate-0 scale-100' : 'rotate-90 scale-0'
            }`}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel className="px-2.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          테마
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {OPTIONS.map(({ mode: m, label, icon: Icon }) => (
          <DropdownMenuItem key={m} onClick={() => setMode(m)} className="rounded-lg">
            <Icon className="mr-2 h-4 w-4" />
            <span className="flex-1">{label}</span>
            {mode === m && <Check className="h-4 w-4 text-brand-700" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
