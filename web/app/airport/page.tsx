'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Wordmark } from '@/components/ui/Wordmark';
import { Tag } from '@/components/ui/Tag';
import { Avatar } from '@/components/ui/Avatar';
import { HowItWorks } from '@/components/ui/HowItWorks';
import { buttonClass } from '@/components/ui/Button';
import { MobileShell } from '@/components/layout/MobileShell';
import { DesktopShell } from '@/components/layout/DesktopShell';
import { fetchAirports } from '@/lib/api/airports';
import { useAuth } from '@/lib/useAuth';
import { initialsOf } from '@/lib/utils';
import type { Airport } from '@/lib/types';

const QUICK_CODES = ['MXP', 'FCO', 'LIN', 'BGY', 'BLQ', 'NAP'];

export default function AirportSelectPage() {
  const router = useRouter();
  const { user, ready } = useAuth();
  const [q, setQ] = useState('');
  const [airports, setAirports] = useState<Airport[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchAirports()
      .then((list) => {
        if (!cancelled) setAirports(list);
      })
      .catch((e) => console.error('fetchAirports', e));
    return () => {
      cancelled = true;
    };
  }, []);

  const matches = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return [];
    return airports
      .filter(
        (a) =>
          a.code.toLowerCase().includes(needle) ||
          a.city.toLowerCase().includes(needle) ||
          a.name.toLowerCase().includes(needle)
      )
      .slice(0, 5);
  }, [q, airports]);

  function go(code: string) {
    router.push(`/airport/${code.toLowerCase()}`);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (matches.length > 0) go(matches[0].code);
  }

  const searchCard = (
    <form onSubmit={onSubmit}>
      <div className="flex items-center gap-3 rounded border border-line bg-card px-4 py-4 transition focus-within:border-primary">
        <Search className="h-5 w-5 text-ink-muted" strokeWidth={2} />
        <div className="flex-1">
          <div className="label-cap">Da quale aeroporto parti?</div>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cerca città o codice…"
            className="mt-0.5 w-full bg-transparent text-[17px] font-medium text-ink placeholder:font-normal placeholder:text-ink-muted focus:outline-none"
          />
        </div>
      </div>

      {matches.length > 0 && (
        <ul className="mt-2 overflow-hidden rounded-sm border border-line bg-card shadow-lg">
          {matches.map((a) => (
            <li key={a.code}>
              <button
                type="button"
                onClick={() => go(a.code)}
                className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-card-alt"
              >
                <span className="text-[14px] font-semibold text-ink">
                  {a.city} <span className="text-ink-soft">· {a.name}</span>
                </span>
                <span className="font-mono text-[13px] font-semibold text-ink-soft">{a.code}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </form>
  );

  const quickChips = (
    <div className="flex flex-wrap gap-2">
      {QUICK_CODES.map((c) => (
        <Link key={c} href={`/airport/${c.toLowerCase()}`}>
          <Tag>{c}</Tag>
        </Link>
      ))}
    </div>
  );

  return (
    <>
      <MobileShell>
        <div className="mb-7 flex items-center justify-between">
          <Wordmark size={22} />
          {ready &&
            (user ? (
              <Link href="/profile" aria-label="Profilo">
                <Avatar
                  initials={initialsOf(user.name)}
                  color={user.avatarColor}
                  size={36}
                />
              </Link>
            ) : (
              <Link href="/login" className={buttonClass('secondary', 'sm')}>
                Accedi
              </Link>
            ))}
        </div>

        <h1 className="mb-1.5 text-[34px] font-semibold leading-[1.05] tracking-tight text-ink">
          Non aspettare
          <br />
          da solo.
        </h1>
        <p className="mb-7 text-[15px] font-normal leading-relaxed text-ink-soft">
          Trova chi parte vicino a te.
          <br />
          Un caffè, una birra, due chiacchiere.
        </p>

        <div className="mb-4">{searchCard}</div>

        <div className="label-cap mb-2.5 ml-1">Oppure scegli al volo</div>
        <div className="mb-7">{quickChips}</div>

        <HowItWorks />
      </MobileShell>

      {/* Desktop: 2 colonne side-by-side, gap 60px */}
      <DesktopShell activeNav="airports">
        <div className="flex flex-col items-center justify-center gap-[60px] py-12 lg:flex-row lg:items-center">
          {/* Hero */}
          <div className="flex-1">
            <h1 className="mb-3 text-[48px] font-semibold leading-[1.05] tracking-tight text-ink">
              Non aspettare
              <br />
              da solo.
            </h1>
            <p className="max-w-[440px] text-[17px] font-normal leading-relaxed text-ink-soft">
              Trova chi parte vicino a te.
              <br />
              Un caffè, una birra, due chiacchiere.
            </p>
          </div>

          {/* Search card */}
          <div className="w-full lg:w-[400px]">
            {searchCard}

            <div className="label-cap mb-2.5 ml-1 mt-5">Oppure scegli al volo</div>
            {quickChips}
          </div>
        </div>

        <HowItWorks className="mx-auto max-w-[900px] pb-10" />
      </DesktopShell>
    </>
  );
}
