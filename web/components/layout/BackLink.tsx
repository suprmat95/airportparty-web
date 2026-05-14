import Link from 'next/link';
import { cn } from '@/lib/utils';

type Props = {
  href: string;
  label?: string;
  className?: string;
};

export function BackLink({ href, label = 'Indietro', className }: Props) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center gap-1 text-[13px] font-semibold text-ink-soft transition hover:text-ink',
        className
      )}
    >
      <span aria-hidden>←</span> {label}
    </Link>
  );
}
