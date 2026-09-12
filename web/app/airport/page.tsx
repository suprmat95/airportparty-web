'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, ChevronDown, Search } from 'lucide-react';
import { Wordmark } from '@/components/ui/Wordmark';
import { Tag } from '@/components/ui/Tag';
import { Avatar } from '@/components/ui/Avatar';
import { HowItWorks } from '@/components/ui/HowItWorks';
import { Calendar } from '@/components/ui/Calendar';
import { buttonClass } from '@/components/ui/Button';
import { MobileShell } from '@/components/layout/MobileShell';
import { DesktopShell } from '@/components/layout/DesktopShell';
import { BottomSheet } from '@/components/layout/BottomSheet';
import { DateTimeModal } from '@/components/layout/DateTimeModal';
import { fetchAirports } from '@/lib/api/airports';
import { useAuth } from '@/lib/useAuth';
import { initialsOf, todayIso } from '@/lib/utils';
import { airportDateHref, fieldDateLabel } from '@/lib/dates';
import type { Airport } from '@/lib/types';

const QUICK_CODES = ['MXP', 'FCO', 'LIN', 'BGY', 'BLQ', 'NAP'];

export default function AirportSelectPage() {
  const router = useRouter();
  const { user, ready } = useAuth();
  const [q, setQ] = useState('');
  const [airports, setAirports] = useState<Airport[]>([]);

  const today = useMemo(() => todayIso(), []);
  const [date, setDate] = useState(today);
  const [dateOpen, setDateOpen] = useState(false);

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
    router.push(airportDateHref(code, date));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (matches.length > 0) go(matches[0].code);
  }

  function pickDate(iso: string) {
    setDate(iso);
    setDateOpen(false);
  }

  const searchCard = (
    <form onSubmit={onSubmit}>
      <div className="rounded border border-line bg-card transition focus-within:border-primary">
        <label className="flex cursor-text items-center gap-3 px-4 py-4">
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
        </label>

        <button
          type="button"
          onClick={() => setDateOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={dateOpen}
          className="flex w-full items-center gap-3 border-t border-line px-4 py-3.5 text-left transition hover:bg-card-alt"
        >
          <CalendarDays className="h-5 w-5 text-ink-muted" strokeWidth={2} />
          <div className="flex-1">
            <div className="label-cap">Quando parti?</div>
            <div className="mt-0.5 text-[15px] font-medium text-ink">
              {fieldDateLabel(date, today)}
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-ink-muted" strokeWidth={2} />
        </button>
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
        <Link key={c} href={airportDateHref(c, date)}>
          <Tag>{c}</Tag>
        </Link>
      ))}
    </div>
  );

  const datePanel = (
    <>
      <h2 className="mb-4 text-[22px] font-semibold tracking-tight text-ink">Quando parti?</h2>
      <Calendar value={date} onChange={pickDate} today={today} />
    </>
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

        <BottomSheet
          open={dateOpen}
          onClose={() => setDateOpen(false)}
          ariaLabel="Scegli il giorno di partenza"
        >
          <div className="px-5 pb-6 pt-2">{datePanel}</div>
        </BottomSheet>
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

        <DateTimeModal
          open={dateOpen}
          onClose={() => setDateOpen(false)}
          ariaLabel="Scegli il giorno di partenza"
        >
          <div className="p-6">{datePanel}</div>
        </DateTimeModal>
      </DesktopShell>
    </>
  );
}
