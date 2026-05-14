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
        'inline-flex items-center rounded-pill px-3 py-1.5 text-xs font-semibold tracking-[0.3px]',
        variant === 'outline' && 'border-[1.5px] border-line text-ink-soft',
        variant === 'filled' && 'bg-primary-soft text-primary-dark',
        className
      )}
    >
      {children}
    </span>
  );
}
