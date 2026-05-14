import type { ReactNode } from 'react';
import { DesktopNavBar, type NavKey } from './DesktopNavBar';
import { cn } from '@/lib/utils';

type Props = {
  children: ReactNode;
  nav?: boolean;
  activeNav?: NavKey;
  /** Set false to remove the centered max-width container (e.g. full-bleed chat). */
  container?: boolean;
  className?: string;
};

export function DesktopShell({
  children,
  nav = true,
  activeNav = null,
  container = true,
  className,
}: Props) {
  return (
    <main className="hidden min-h-screen bg-bg lg:flex lg:flex-col">
      {nav && <DesktopNavBar active={activeNav} />}
      {container ? (
        <div
          className={cn(
            'mx-auto w-full max-w-[1120px] flex-1 px-10 py-7',
            className
          )}
        >
          {children}
        </div>
      ) : (
        <div className={cn('flex flex-1 flex-col', className)}>{children}</div>
      )}
    </main>
  );
}
