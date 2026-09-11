import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  children: ReactNode;
  variant?: 'outline' | 'filled';
  className?: string;
};

export function Tag({ children, variant = 'outline', className }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm border px-2.5 py-1 font-mono text-[11px] font-semibold tracking-[0.3px]',
        variant === 'outline' && 'border-line bg-card text-ink-soft',
        variant === 'filled' && 'border-line bg-card-alt text-ink-soft',
        className
      )}
    >
      {children}
    </span>
  );
}
