import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
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
        'inline-flex items-center gap-1 text-[13px] font-medium text-ink-soft transition hover:text-ink',
        className
      )}
    >
      <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
      {label}
    </Link>
  );
}
