'use client';

import Link from 'next/link';
import { Wordmark } from '@/components/ui/Wordmark';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/useAuth';
import { initialsOf, cn } from '@/lib/utils';

export type NavKey = 'airports' | 'my-slots' | 'profile' | null;

type Props = {
  active?: NavKey;
};

const LINKS: { key: Exclude<NavKey, null | 'profile'>; label: string; href: string }[] = [
  { key: 'airports', label: 'Aeroporti', href: '/airport' },
  { key: 'my-slots', label: 'I miei slot', href: '/my-slots' },
];

export function DesktopNavBar({ active = null }: Props) {
  const { user, ready } = useAuth();

  return (
    <header className="h-14 border-b border-line bg-card">
      <div className="mx-auto flex h-full max-w-[1120px] items-center justify-between px-10">
        <Link href="/airport" className="flex items-center">
          <Wordmark size={22} />
        </Link>

        <nav className="flex items-center gap-1">
          {LINKS.map((link) => {
            const isActive = active === link.key;
            return (
              <Link
                key={link.key}
                href={link.href}
                className={cn(
                  'rounded-sm px-3 py-1.5 text-sm font-medium transition',
                  isActive
                    ? 'bg-card-alt text-ink'
                    : 'text-ink-soft hover:bg-card-alt hover:text-ink'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex h-9 w-9 items-center justify-end">
          {ready &&
            (user ? (
              <Link
                href="/profile"
                aria-label="profilo"
                className={cn(
                  'rounded-pill transition hover:opacity-90',
                  active === 'profile' &&
                    'ring-2 ring-primary ring-offset-2 ring-offset-card'
                )}
              >
                <Avatar
                  initials={initialsOf(user.name)}
                  color={user.avatarColor}
                  size={36}
                />
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="secondary" size="sm">
                  Accedi
                </Button>
              </Link>
            ))}
        </div>
      </div>
    </header>
  );
}
