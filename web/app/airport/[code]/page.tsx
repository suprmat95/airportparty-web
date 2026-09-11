'use client';

import { notFound, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Edit } from 'lucide-react';
import { MobileShell } from '@/components/layout/MobileShell';
import { NavBar } from '@/components/layout/NavBar';
import { BottomSheet } from '@/components/layout/BottomSheet';
import { DesktopShell } from '@/components/layout/DesktopShell';
import { BackLink } from '@/components/layout/BackLink';
import { DateTimeModal } from '@/components/layout/DateTimeModal';
import { Tag } from '@/components/ui/Tag';
import { SlotCard } from '@/components/ui/SlotCard';
import { SlotRow } from '@/components/ui/SlotRow';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/lib/useAuth';
import { fetchAirport } from '@/lib/api/airports';
import { fetchSlotsForAirport } from '@/lib/api/slots';
import { generateVirtualSlots, mergeSlots } from '@/lib/api/virtual';
import type { TimelineSlot } from '@/lib/api/types';
import type { Airport } from '@/lib/types';
import { addDays, cn, initialsOf, formatDateIT, pad2, todayIso } from '@/lib/utils';

type TimeRange = 'all' | 'morning' | 'afternoon' | 'evening';

const TIME_RANGES: { id: TimeRange; label: string; sub: string; from: string; to: string }[] = [
  { id: 'all', label: 'Tutto il giorno', sub: '00:00 – 23:59', from: '00:00', to: '23:59' },
  { id: 'morning', label: 'Mattina', sub: '06:00 – 12:00', from: '06:00', to: '12:00' },
  { id: 'afternoon', label: 'Pomeriggio', sub: '12:00 – 18:00', from: '12:00', to: '18:00' },
  { id: 'evening', label: 'Sera', sub: '18:00 – 00:00', from: '18:00', to: '23:59' },
];

const DAY_SHORT = ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'];
const MONTH_FULL_IT = [
  'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
  'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre',
];

function dayChipLabel(iso: string, today: string): string | null {
  if (iso === today) return 'oggi';
  if (iso === addDays(today, 1)) return 'domani';
  return null;
}

function ctaLabel(iso: string, today: string): string {
  const label = dayChipLabel(iso, today);
  if (label) return label;
  const d = new Date(`${iso}T00:00:00`);
  return `${DAY_SHORT[d.getDay()]} ${d.getDate()}`;
}

function heroDateLabel(iso: string, today: string): string {
  const chip = dayChipLabel(iso, today);
  if (chip) return chip;
  const d = new Date(`${iso}T00:00:00`);
  return `il ${d.getDate()} ${MONTH_FULL_IT[d.getMonth()]}`;
}

function airportShortName(airport: { name: string; city: string }): string {
  const prefix = `${airport.city} `;
  return airport.name.startsWith(prefix)
    ? airport.name.slice(prefix.length)
    : airport.name;
}

export default function AirportTimelinePage({ params }: { params: { code: string } }) {
  const router = useRouter();
  const { user } = useAuth();

  const [airport, setAirport] = useState<Airport | null>(null);
  const [airportLoading, setAirportLoading] = useState(true);
  const [airportMissing, setAirportMissing] = useState(false);

  const [slots, setSlots] = useState<TimelineSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(true);

  const today = useMemo(() => todayIso(), []);

  const [date, setDate] = useState(today);
  const [range, setRange] = useState<TimeRange>('all');
  const [sheetOpen, setSheetOpen] = useState(false);

  const [draftDate, setDraftDate] = useState(today);
  const [draftRange, setDraftRange] = useState<TimeRange>('all');

  useEffect(() => {
    let cancelled = false;
    setAirportLoading(true);
    fetchAirport(params.code)
      .then((a) => {
        if (cancelled) return;
        if (!a) setAirportMissing(true);
        else setAirport(a);
      })
      .catch((e) => {
        console.error('fetchAirport', e);
      })
      .finally(() => {
        if (!cancelled) setAirportLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [params.code]);

  useEffect(() => {
    if (!airport) return;
    let cancelled = false;
    setSlotsLoading(true);
    fetchSlotsForAirport(airport.code, date)
      .then((reals) => {
        if (cancelled) return;
        const virtuals = generateVirtualSlots(airport.code, date);
        setSlots(mergeSlots(virtuals, reals));
      })
      .catch((e) => {
        console.error('fetchSlotsForAirport', e);
        if (!cancelled) {
          const virtuals = generateVirtualSlots(airport.code, date);
          setSlots(virtuals);
        }
      })
      .finally(() => {
        if (!cancelled) setSlotsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [airport, date]);

  const [currentTime, setCurrentTime] = useState(() => {
    const n = new Date();
    return `${pad2(n.getHours())}:${pad2(n.getMinutes())}`;
  });

  useEffect(() => {
    if (date !== today) return;
    const id = setInterval(() => {
      const n = new Date();
      setCurrentTime(`${pad2(n.getHours())}:${pad2(n.getMinutes())}`);
    }, 30_000);
    return () => clearInterval(id);
  }, [date, today]);

  const filteredSlots = useMemo(() => {
    const r = TIME_RANGES.find((x) => x.id === range)!;
    const isToday = date === today;
    return slots.filter((s) => {
      if (s.startTime < r.from || s.startTime > r.to) return false;
      if (isToday && s.startTime < currentTime) return false;
      return true;
    });
  }, [slots, range, date, today, currentTime]);

  const goToSlot = useCallback(
    (slotId: string) => {
      if (!airport) return;
      router.push(`/airport/${airport.code.toLowerCase()}/${slotId}`);
    },
    [airport, router]
  );

  function openSheet() {
    setDraftDate(date);
    setDraftRange(range);
    setSheetOpen(true);
  }

  function applyFilters() {
    setDate(draftDate);
    setRange(draftRange);
    setSheetOpen(false);
  }

  if (airportMissing) notFound();
  if (airportLoading || !airport) {
    return (
      <>
        <MobileShell>
          <NavBar back="/airport" />
          <div className="flex flex-1 items-center justify-center text-[13px] font-medium text-ink-soft">
            Caricamento…
          </div>
        </MobileShell>
        <DesktopShell activeNav="airports">
          <div className="flex h-[60vh] items-center justify-center text-[13px] font-medium text-ink-soft">
            Caricamento…
          </div>
        </DesktopShell>
      </>
    );
  }

  const airportCode = airport.code;

  const isToday = date === today;
  const heroLabel = heroDateLabel(date, today);
  const airportShort = airportShortName(airport);
  const sublineDate = isToday
    ? 'Slot di oggi, ogni ora'
    : `${ctaLabel(date, today)}, ogni ora`;
  const sublineRange = range === 'all' ? '' : ` · ${TIME_RANGES.find((r) => r.id === range)!.label.toLowerCase()}`;

  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i));
  const sheetMonth = (() => {
    const d = new Date(`${draftDate}T00:00:00`);
    return `${MONTH_FULL_IT[d.getMonth()]} ${d.getFullYear()}`;
  })();

  function buildAvatars(slot: TimelineSlot) {
    const participants = slot.participants;
    const avatars = participants.slice(0, 4).map((p) => ({
      initials: initialsOf(p.profile.name),
      color: p.profile.avatarColor,
    }));
    return { participants, avatars };
  }

  return (
    <>
      <MobileShell>
        <NavBar back="/airport" right={<Tag variant="filled">{airportCode}</Tag>} />

        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="label-cap">{formatDateIT(date)}</div>
            <div className="mt-0.5 text-[13px] font-medium text-ink-soft">
              {sublineDate}
              {sublineRange}
            </div>
          </div>
          <button
            type="button"
            aria-label="Modifica data e fascia oraria"
            onClick={openSheet}
            className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-line text-ink-soft transition hover:bg-card-alt"
          >
            <Edit className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <h1 className="mb-5 text-[26px] font-semibold leading-[1.1] tracking-tight text-ink">
          Chi c’è {heroLabel}
          <br />a {airportShort}?
        </h1>

        <div className="relative">
          <div
            className="pointer-events-none absolute left-[7px] top-2 bottom-2 w-px"
            style={{
              backgroundImage:
                'linear-gradient(to bottom, var(--line) 0 6px, transparent 6px 12px)',
              backgroundSize: '1px 12px',
              backgroundRepeat: 'repeat-y',
            }}
          />

          {slotsLoading && (
            <Card dashed className="ml-6 p-5 text-center text-[13px] font-medium text-ink-soft">
              Caricamento slot…
            </Card>
          )}

          {!slotsLoading && filteredSlots.length === 0 && (
            <Card dashed className="ml-6 p-5 text-center text-[13px] font-medium text-ink-soft">
              Nessuno slot in questa fascia. Prova ad allargare i filtri.
            </Card>
          )}

          <ul className="space-y-3 pl-6">
            {filteredSlots.map((slot) => {
              const { participants, avatars } = buildAvatars(slot);
              const joined = user ? participants.some((p) => p.userId === user.id) : false;
              const going = participants.length;
              const highlight = going >= 4;

              return (
                <li key={slot.id} className="relative">
                  <span
                    className="absolute -left-[22px] top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-line bg-card"
                    style={
                      highlight
                        ? { borderColor: 'var(--primary)', background: 'var(--primary)' }
                        : undefined
                    }
                  />
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => goToSlot(slot.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        goToSlot(slot.id);
                      }
                    }}
                    className="block w-full cursor-pointer text-left"
                  >
                    <SlotCard
                      time={slot.startTime}
                      going={going}
                      avatars={avatars}
                      highlight={highlight}
                      joined={joined}
                      onJoin={() => goToSlot(slot.id)}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-6 flex justify-center">
          <BackLink href="/airport" label="Cambia aeroporto" className="mx-auto" />
        </div>

        {/* S01B — bottom sheet mobile */}
        <BottomSheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          ariaLabel="Modifica data e fascia oraria"
        >
          <div className="px-5 pb-5 pt-2">
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="text-[22px] font-semibold tracking-tight text-ink">
                Quando parti?
              </h2>
              <div className="text-[12px] font-semibold capitalize text-ink-soft">
                {sheetMonth}
              </div>
            </div>

            <div className="-mx-5 mb-5 overflow-x-auto px-5">
              <div className="flex gap-2 pb-1">
                {days.map((iso) => {
                  const d = new Date(`${iso}T00:00:00`);
                  const active = draftDate === iso;
                  const label = dayChipLabel(iso, today);
                  return (
                    <button
                      key={iso}
                      type="button"
                      onClick={() => setDraftDate(iso)}
                      className={cn(
                        'flex min-w-[60px] flex-col items-center rounded-sm border px-2 py-2.5 transition',
                        active
                          ? 'border-primary bg-primary text-white'
                          : 'border-line bg-card text-ink hover:bg-card-alt'
                      )}
                    >
                      <span
                        className={cn(
                          'text-[10px] font-semibold uppercase tracking-[1px]',
                          active ? 'text-white/80' : 'text-ink-muted'
                        )}
                      >
                        {DAY_SHORT[d.getDay()]}
                      </span>
                      <span className="mt-1 font-mono text-[18px] font-bold leading-none">
                        {d.getDate()}
                      </span>
                      {label && (
                        <span
                          className={cn(
                            'mt-1 text-[10px] font-semibold',
                            active ? 'text-white' : 'text-primary'
                          )}
                        >
                          {label}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="label-cap mb-2">fascia oraria</div>
            <div role="radiogroup" aria-label="fascia oraria" className="mb-5 space-y-2">
              {TIME_RANGES.map((r) => {
                const active = draftRange === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setDraftRange(r.id)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-sm border px-4 py-3 text-left transition',
                      active
                        ? 'border-primary bg-primary-soft'
                        : 'border-line bg-card hover:bg-card-alt'
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-pill border',
                        active ? 'border-primary' : 'border-line'
                      )}
                    >
                      {active && <span className="h-2.5 w-2.5 rounded-pill bg-primary" />}
                    </span>
                    <div className="flex-1">
                      <div
                        className={cn(
                          'text-[14px] font-semibold',
                          active ? 'text-primary-dark' : 'text-ink'
                        )}
                      >
                        {r.label}
                      </div>
                      {r.id !== 'all' && (
                        <div className="font-mono text-[11px] font-semibold text-ink-soft">
                          {r.sub}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <Button variant="primary" fullWidth onClick={applyFilters}>
              Mostra slot di {ctaLabel(draftDate, today)}
            </Button>
          </div>
        </BottomSheet>
      </MobileShell>

      {/* Desktop: colonna 720px con SlotRow */}
      <DesktopShell activeNav="airports">
        <div className="mx-auto max-w-[720px]">
          <BackLink href="/airport" label="Cambia aeroporto" className="mb-4" />

          <Card className="mb-5 flex items-center justify-between gap-3 p-4">
            <div className="flex items-center gap-3">
              <Tag variant="filled">{airportCode}</Tag>
              <div>
                <div className="text-[15px] font-semibold capitalize text-ink">
                  {formatDateIT(date)}
                </div>
                <div className="mt-0.5 text-[12px] font-medium text-ink-soft">
                  {sublineDate}
                  {sublineRange}
                </div>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={openSheet}>
              <Edit className="h-3.5 w-3.5" strokeWidth={2} />
              Modifica
            </Button>
          </Card>

          <h1 className="mb-5 text-[34px] font-semibold leading-[1.1] tracking-tight text-ink">
            Chi c’è {heroLabel} a {airportShort}?
          </h1>

          {slotsLoading ? (
            <Card dashed className="p-8 text-center text-[14px] font-medium text-ink-soft">
              Caricamento slot…
            </Card>
          ) : filteredSlots.length === 0 ? (
            <Card dashed className="p-8 text-center text-[14px] font-medium text-ink-soft">
              Nessuno slot in questa fascia. Prova ad allargare i filtri.
            </Card>
          ) : (
            <ul className="space-y-3">
              {filteredSlots.map((slot) => {
                const { participants, avatars } = buildAvatars(slot);
                const joined = user ? participants.some((p) => p.userId === user.id) : false;
                const going = participants.length;
                const highlight = going >= 4;

                return (
                  <li key={slot.id}>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => goToSlot(slot.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          goToSlot(slot.id);
                        }
                      }}
                      className="block w-full cursor-pointer text-left"
                    >
                      <SlotRow
                        time={slot.startTime}
                        going={going}
                        avatars={avatars}
                        highlight={highlight}
                        joined={joined}
                        onJoin={() => goToSlot(slot.id)}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <DateTimeModal
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          ariaLabel="Modifica data e fascia oraria"
        >
          <div className="p-6">
            <div className="mb-5 flex items-baseline justify-between">
              <h2 className="text-[22px] font-semibold tracking-tight text-ink">
                Quando parti?
              </h2>
              <div className="text-[12px] font-semibold capitalize text-ink-soft">
                {sheetMonth}
              </div>
            </div>

            <div className="mb-6 flex gap-2">
              {days.map((iso) => {
                const d = new Date(`${iso}T00:00:00`);
                const active = draftDate === iso;
                const label = dayChipLabel(iso, today);
                return (
                  <button
                    key={iso}
                    type="button"
                    onClick={() => setDraftDate(iso)}
                    className={cn(
                      'flex flex-1 flex-col items-center rounded-sm border px-1 py-2.5 transition',
                      active
                        ? 'border-primary bg-primary text-white'
                        : 'border-line bg-card text-ink hover:bg-card-alt'
                    )}
                  >
                    <span
                      className={cn(
                        'text-[10px] font-semibold uppercase tracking-[1px]',
                        active ? 'text-white/80' : 'text-ink-muted'
                      )}
                    >
                      {DAY_SHORT[d.getDay()]}
                    </span>
                    <span className="mt-1 font-mono text-[18px] font-bold leading-none">
                      {d.getDate()}
                    </span>
                    {label && (
                      <span
                        className={cn(
                          'mt-1 text-[10px] font-semibold',
                          active ? 'text-white' : 'text-primary'
                        )}
                      >
                        {label}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="label-cap mb-2">fascia oraria</div>
            <div role="radiogroup" aria-label="fascia oraria" className="mb-6 grid grid-cols-2 gap-2">
              {TIME_RANGES.map((r) => {
                const active = draftRange === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setDraftRange(r.id)}
                    className={cn(
                      'flex items-center gap-2.5 rounded-sm border px-3.5 py-3 text-left transition',
                      active
                        ? 'border-primary bg-primary-soft'
                        : 'border-line bg-card hover:bg-card-alt'
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-pill border',
                        active ? 'border-primary' : 'border-line'
                      )}
                    >
                      {active && <span className="h-2.5 w-2.5 rounded-pill bg-primary" />}
                    </span>
                    <div className="flex-1">
                      <div
                        className={cn(
                          'text-[13px] font-semibold leading-tight',
                          active ? 'text-primary-dark' : 'text-ink'
                        )}
                      >
                        {r.label}
                      </div>
                      {r.id !== 'all' && (
                        <div className="font-mono text-[10px] font-semibold text-ink-soft">
                          {r.sub}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button variant="secondary" onClick={() => setSheetOpen(false)}>
                Annulla
              </Button>
              <Button variant="primary" onClick={applyFilters}>
                Mostra slot di {ctaLabel(draftDate, today)}
              </Button>
            </div>
          </div>
        </DateTimeModal>
      </DesktopShell>
    </>
  );
}
