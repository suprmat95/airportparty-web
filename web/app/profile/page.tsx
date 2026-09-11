'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { MobileShell } from '@/components/layout/MobileShell';
import { NavBar } from '@/components/layout/NavBar';
import { DesktopShell } from '@/components/layout/DesktopShell';
import { BackLink } from '@/components/layout/BackLink';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { buttonClass } from '@/components/ui/Button';
import { useAuth } from '@/lib/useAuth';
import { fetchProfileStats } from '@/lib/api/profile';
import type { ProfileStats } from '@/lib/api/types';
import { initialsOf } from '@/lib/utils';

const MENU = [
  { label: 'I miei slot', href: '/my-slots' },
  { label: 'Notifiche', href: '/profile' },
  { label: 'Sicurezza', href: '/profile' },
  { label: 'Impostazioni', href: '/profile' },
  { label: 'Aiuto', href: '/profile' },
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, ready, signOut } = useAuth();
  const [stats, setStats] = useState<ProfileStats>({ slots: 0, encounters: 0, airports: 0 });

  useEffect(() => {
    if (ready && !user) router.replace('/login');
  }, [ready, user, router]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    fetchProfileStats(user.id)
      .then((s) => {
        if (!cancelled) setStats(s);
      })
      .catch((e) => console.error('fetchProfileStats', e));
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!ready || !user) {
    return (
      <>
        <MobileShell>
          <NavBar back="/airport" />
          <div className="flex flex-1 items-center justify-center text-[13px] font-medium text-ink-soft">
            Caricamento…
          </div>
        </MobileShell>
        <DesktopShell activeNav="profile">
          <div className="flex h-[60vh] items-center justify-center text-[13px] font-medium text-ink-soft">
            Caricamento…
          </div>
        </DesktopShell>
      </>
    );
  }

  const statItems = [
    { value: stats.slots, label: 'slot' },
    { value: stats.encounters, label: 'incontri' },
    { value: stats.airports, label: 'aeroporti' },
  ];

  async function handleSignOut() {
    await signOut();
    router.push('/airport');
    router.refresh();
  }

  return (
    <>
      <MobileShell>
        <NavBar back="/airport" />

        <div className="mb-5 flex flex-col items-center text-center">
          <Avatar
            initials={initialsOf(user.name)}
            color={user.avatarColor}
            size={84}
          />
          <h1 className="mt-3 text-[22px] font-semibold tracking-tight text-ink">
            {user.name}
          </h1>
          <p className="text-[12px] font-medium text-ink-soft">{user.email}</p>
        </div>

        <div className="mb-5 grid grid-cols-3 gap-2">
          {statItems.map((s) => (
            <Stat key={s.label} value={s.value} label={s.label} />
          ))}
        </div>

        <ul className="mb-5 overflow-hidden rounded border border-line bg-card">
          {MENU.map((item, i) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className={
                  'flex items-center justify-between px-4 py-3.5 text-[14px] font-medium text-ink hover:bg-card-alt' +
                  (i < MENU.length - 1 ? ' border-b border-line' : '')
                }
              >
                <span>{item.label}</span>
                <ChevronRight className="h-4 w-4 text-ink-muted" strokeWidth={2} />
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={handleSignOut}
          className={buttonClass('secondary', 'md', true)}
        >
          Esci
        </button>
      </MobileShell>

      {/* Desktop: 2 colonne 780px — profilo card sx, menu dx */}
      <DesktopShell activeNav="profile">
        <div className="mx-auto max-w-[780px]">
          <BackLink href="/airport" label="Indietro" className="mb-5" />

          <div className="flex gap-7">
            <aside className="w-[280px] flex-shrink-0">
              <Card className="p-6 text-center">
                <div className="flex justify-center">
                  <Avatar
                    initials={initialsOf(user.name)}
                    color={user.avatarColor}
                    size={88}
                  />
                </div>
                <h1 className="mt-3 text-[22px] font-semibold tracking-tight text-ink">
                  {user.name}
                </h1>
                <p className="mt-0.5 text-[12px] font-medium text-ink-soft">{user.email}</p>
                <Link
                  href="/profile"
                  className="mt-3 inline-block text-[12px] font-semibold text-primary underline"
                >
                  Modifica profilo
                </Link>
              </Card>

              <Card className="mt-4 grid grid-cols-3 gap-2 p-3">
                {statItems.map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="font-mono text-[20px] font-bold leading-none text-ink">
                      {s.value}
                    </div>
                    <div className="label-cap mt-1">{s.label}</div>
                  </div>
                ))}
              </Card>
            </aside>

            <section className="flex-1">
              <h2 className="mb-3 text-[20px] font-semibold tracking-tight text-ink">
                Impostazioni
              </h2>
              <ul className="overflow-hidden rounded border border-line bg-card">
                {MENU.map((item, i) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={
                        'flex items-center justify-between px-5 py-4 text-[15px] font-medium text-ink hover:bg-card-alt' +
                        (i < MENU.length - 1 ? ' border-b border-line' : '')
                      }
                    >
                      <span>{item.label}</span>
                      <ChevronRight className="h-4 w-4 text-ink-muted" strokeWidth={2} />
                    </Link>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={handleSignOut}
                className={buttonClass('secondary', 'md', false, 'mt-5')}
              >
                Esci
              </button>
            </section>
          </div>
        </div>
      </DesktopShell>
    </>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <Card className="p-3 text-center">
      <div className="font-mono text-[22px] font-bold leading-none text-ink">{value}</div>
      <div className="label-cap mt-1">{label}</div>
    </Card>
  );
}
