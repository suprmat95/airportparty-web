'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { MobileShell } from '@/components/layout/MobileShell';
import { NavBar } from '@/components/layout/NavBar';
import { DesktopShell } from '@/components/layout/DesktopShell';
import { BackLink } from '@/components/layout/BackLink';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { MySlotCard } from '@/components/ui/MySlotCard';
import type { AvatarStackItem } from '@/components/ui/AvatarStack';
import { Button, buttonClass } from '@/components/ui/Button';
import { useAuth } from '@/lib/useAuth';
import { fetchMyJoinedSlots } from '@/lib/api/participants';
import { fetchSlot } from '@/lib/api/slots';
import type { MyJoinedSlot } from '@/lib/api/types';
import { getSlotStatus, initialsOf, todayIso, type SlotStatus } from '@/lib/utils';

type TabId = 'today' | 'upcoming' | 'past';

type EnrichedSlot = {
  slot: MyJoinedSlot;
  status: SlotStatus;
  avatars: AvatarStackItem[];
};

export default function MySlotsPage() {
  const router = useRouter();
  const { user, ready } = useAuth();

  const [tab, setTab] = useState<TabId>('today');
  const [joins, setJoins] = useState<MyJoinedSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [avatarsBySlot, setAvatarsBySlot] = useState<Record<string, AvatarStackItem[]>>({});

  useEffect(() => {
    if (ready && !user) router.replace('/login');
  }, [ready, user, router]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setLoading(true);
    fetchMyJoinedSlots()
      .then(async (list) => {
        if (cancelled) return;
        setJoins(list);
        // Fetch avatars for each slot (top 4 participants)
        const avatarMap: Record<string, AvatarStackItem[]> = {};
        await Promise.all(
          list.map(async (j) => {
            const slot = await fetchSlot(j.id);
            if (slot) {
              avatarMap[j.id] = slot.participants.slice(0, 4).map((p) => ({
                initials: initialsOf(p.profile.name),
                color: p.profile.avatarColor,
              }));
            }
          })
        );
        if (!cancelled) setAvatarsBySlot(avatarMap);
      })
      .catch((e) => {
        console.error('fetchMyJoinedSlots', e);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const today = useMemo(() => todayIso(), []);

  const enriched: EnrichedSlot[] = useMemo(() => {
    return joins
      .map((slot) => ({
        slot,
        status: getSlotStatus(slot.date, slot.startTime, slot.durationMinutes),
        avatars: avatarsBySlot[slot.id] ?? [],
      }))
      .sort((a, b) => {
        if (a.slot.date !== b.slot.date) return a.slot.date.localeCompare(b.slot.date);
        return a.slot.startTime.localeCompare(b.slot.startTime);
      });
  }, [joins, avatarsBySlot]);

  const byTab = useMemo(() => {
    const today_ = enriched.filter((e) => e.slot.date === today);
    const upcoming = enriched.filter((e) => e.slot.date > today);
    const past = enriched.filter((e) => e.slot.date < today);
    return { today: today_, upcoming, past };
  }, [enriched, today]);

  const counts = {
    today: byTab.today.length,
    upcoming: byTab.upcoming.length,
    past: byTab.past.length,
  };

  const tabs = [
    { id: 'today' as const, label: 'Oggi', count: counts.today },
    { id: 'upcoming' as const, label: 'Prossimi', count: counts.upcoming },
    { id: 'past' as const, label: 'Passati', count: counts.past },
  ];

  const list = byTab[tab];

  if (!ready || !user) {
    return (
      <>
        <MobileShell>
          <NavBar back="/airport" />
          <div className="flex flex-1 items-center justify-center text-[13px] font-medium text-ink-soft">
            Caricamento…
          </div>
        </MobileShell>
        <DesktopShell activeNav="my-slots">
          <div className="flex h-[60vh] items-center justify-center text-[13px] font-medium text-ink-soft">
            Caricamento…
          </div>
        </DesktopShell>
      </>
    );
  }

  const heading = (
    <>
      <h1 className="text-[28px] font-extrabold tracking-tighter text-ink lg:text-[34px]">
        I miei <span className="text-primary">slot</span>
      </h1>
      <p className="mt-0.5 text-[13px] font-medium text-ink-soft lg:text-[14px]">
        I gruppi a cui ti sei unito.
      </p>
    </>
  );

  const emptyState = (
    <div className="rounded-[20px] border-[1.5px] border-dashed border-line bg-card p-8 text-center">
      <div className="mb-2 text-[32px] leading-none">✈</div>
      <div className="text-[14px] font-bold text-ink">Nessuno slot qui</div>
      <p className="mt-1 text-[12px] font-medium text-ink-soft">
        {tab === 'today' && 'Niente di programmato per oggi.'}
        {tab === 'upcoming' && 'Nessuno slot futuro a cui ti sei unito.'}
        {tab === 'past' && 'Non hai slot passati registrati.'}
      </p>
    </div>
  );

  const slotHref = (slotId: string) => `/slot/${slotId}`;

  return (
    <>
      <MobileShell>
        <NavBar back="/profile" />

        <div className="mb-5">{heading}</div>

        <div className="mb-4">
          <SegmentedTabs<TabId> items={tabs} active={tab} onChange={setTab} />
        </div>

        {loading ? (
          <div className="rounded-[20px] border-[1.5px] border-dashed border-line bg-card p-8 text-center text-[13px] font-medium text-ink-soft">
            Caricamento…
          </div>
        ) : list.length === 0 ? (
          emptyState
        ) : (
          <ul className="space-y-3">
            {list.map((e) => (
              <li key={e.slot.id}>
                <MySlotCard
                  slot={e.slot}
                  airportCity={e.slot.airportCity}
                  status={e.status}
                  avatars={e.avatars}
                  participantsCount={e.slot.participantsCount}
                  destination={e.slot.destination}
                  href={slotHref(e.slot.id)}
                  showDate={tab !== 'today'}
                />
              </li>
            ))}
          </ul>
        )}

        <div className="flex-1" />

        <Link href="/airport" className={buttonClass('primary', 'md', true, 'mt-6')}>
          cerca nuovi slot ✈
        </Link>
      </MobileShell>

      <DesktopShell activeNav="my-slots">
        <div className="mx-auto max-w-[820px]">
          <BackLink href="/profile" label="Indietro" className="mb-5" />

          <div className="mb-6 flex items-end justify-between gap-4">
            <div>{heading}</div>
            <Link href="/airport">
              <Button variant="primary" size="md">
                cerca nuovi slot ✈
              </Button>
            </Link>
          </div>

          <div className="mb-5">
            <SegmentedTabs<TabId>
              items={tabs}
              active={tab}
              onChange={setTab}
              fullWidth={false}
            />
          </div>

          {loading ? (
            <div className="rounded-[20px] border-[1.5px] border-dashed border-line bg-card p-8 text-center text-[13px] font-medium text-ink-soft">
              Caricamento…
            </div>
          ) : list.length === 0 ? (
            emptyState
          ) : (
            <ul className="grid grid-cols-2 gap-3.5">
              {list.map((e) => (
                <li key={e.slot.id}>
                  <MySlotCard
                    slot={e.slot}
                    airportCity={e.slot.airportCity}
                    status={e.status}
                    avatars={e.avatars}
                    participantsCount={e.slot.participantsCount}
                    destination={e.slot.destination}
                    href={slotHref(e.slot.id)}
                    showDate={tab !== 'today'}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </DesktopShell>
    </>
  );
}
