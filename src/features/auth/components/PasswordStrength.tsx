interface PasswordStrengthProps {
  value: string;
}

function score(pw: string): number {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s += 1;
  if (pw.length >= 12) s += 1;
  if (/[a-zA-Z]/.test(pw) && /\d/.test(pw)) s += 1;
  if (/[!@#$%^&*]/.test(pw)) s += 1;
  return Math.min(s, 4);
}

const LEVELS = [
  { label: '취약', color: 'bg-rose-500', text: 'text-rose-600' },
  { label: '보통', color: 'bg-amber-500', text: 'text-amber-600' },
  { label: '괜찮음', color: 'bg-yellow-500', text: 'text-yellow-700' },
  { label: '강력', color: 'bg-brand-500', text: 'text-brand-700' },
];

export function PasswordStrength({ value }: PasswordStrengthProps) {
  if (!value) return null;
  const s = score(value);
  const level = LEVELS[Math.max(0, s - 1)] ?? LEVELS[0];

  return (
    <div className="mt-1.5 flex items-center gap-2">
      <div className="flex flex-1 gap-1">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i < s ? level.color : 'bg-muted'
            }`}
          />
        ))}
      </div>
      <span className={`min-w-[3.5rem] text-right text-[11px] font-medium ${level.text}`}>
        {level.label}
      </span>
    </div>
  );
}
