import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Wordmark } from '@/components/ui/Wordmark';
import { cn } from '@/lib/utils';

type Props = {
  back?: string;
  right?: ReactNode;
  className?: string;
};

export function NavBar({ back = '/', right, className }: Props) {
  return (
    <div className={cn('mb-5 flex items-center justify-between', className)}>
      <Link
        href={back}
        aria-label="Indietro"
        className="-ml-1 inline-flex h-9 w-9 items-center justify-center rounded-sm text-ink-soft hover:bg-card-alt"
      >
        <ArrowLeft className="h-5 w-5" strokeWidth={2} />
      </Link>
      <Wordmark size={20} />
      <div className="flex min-w-[36px] items-center justify-end">{right}</div>
    </div>
  );
}
