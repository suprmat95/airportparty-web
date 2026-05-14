import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  children: ReactNode;
  className?: string;
};

export function MobileShell({ children, className }: Props) {
  return (
    <main className="min-h-screen bg-bg lg:hidden">
      <div
        className={cn(
          'mx-auto flex min-h-screen w-full max-w-[420px] flex-col bg-bg px-5 pb-6 pt-6',
          className
        )}
      >
        {children}
      </div>
    </main>
  );
}
