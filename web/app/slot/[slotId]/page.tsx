'use client';

import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Clock } from 'lucide-react';
import { MobileShell } from '@/components/layout/MobileShell';
import { NavBar } from '@/components/layout/NavBar';
import { DesktopShell } from '@/components/layout/DesktopShell';
import { BackLink } from '@/components/layout/BackLink';
import { Card } from '@/components/ui/Card';
import { Tag } from '@/components/ui/Tag';
import { PersonRow } from '@/components/ui/PersonRow';
import { buttonClass } from '@/components/ui/Button';
import { useAuth } from '@/lib/useAuth';
import { fetchAirport } from '@/lib/api/airports';
import { fetchSlot } from '@/lib/api/slots';
import { leaveSlot } from '@/lib/api/participants';
import type { SlotWithParticipants } from '@/lib/api/types';
import type { Airport } from '@/lib/types';
import {
  chatOpensAt,
  computeCountdown,
  formatDateIT,
  initialsOf,
  pad2,
} from '@/lib/utils';
import { matchKind, sameDestinationLabel, sortByAffinity } from '@/lib/affinity';

export default function SlotStatusPage({ params }: { params: { slotId: string } }) {
  const router = useRouter();
  const { user } = useAuth();

  const [slot, setSlot] = useState<SlotWithParticipants | null>(null);
  const [airport, setAirport] = useState<Airport | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchSlot(params.slotId)
      .then(async (s) => {
        if (cancelled) return;
        if (!s) {
          setMissing(true);
          return;
        }
        setSlot(s);
        const a = await fetchAirport(s.airportCode);
        if (!cancelled) setAirport(a);
      })
      .catch((e) => {
        console.error('slot fetch', e);
        if (!cancelled) setMissing(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [params.slotId]);

  const target = useMemo(
    () => (slot ? chatOpensAt(slot.date, slot.startTime) : null),
    [slot]
  );
  const [tick, setTick] = useState(() => computeCountdown(target ?? new Date()));

  useEffect(() => {
    if (!target) return;
    setTick(computeCountdown(target));
    const id = setInterval(() => setTick(computeCountdown(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (missing) notFound();
  if (loading || !slot) {
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

  const chatOpen = tick.done;
  const participants = slot.participants;
  const joined = user ? participants.some((p) => p.userId === user.id) : false;

  async function onLeave() {
    if (!slot) return;
    if (!confirm('Sicuro di voler uscire dallo slot?')) return;
    setLeaving(true);
    const { error } = await leaveSlot(slot.id);
    setLeaving(false);
    if (error) {
      alert(`Errore: ${error}`);
      return;
    }
    router.push(`/airport/${slot.airportCode.toLowerCase()}`);
    router.refresh();
  }

  const countdownBox = chatOpen ? (
    <Card highlight className="p-5 text-center lg:p-7">
      <div className="label-cap text-primary-dark">La chat è aperta</div>
      <div className="mt-2 text-[26px] font-semibold leading-tight tracking-tight text-ink lg:text-[32px]">
        È il momento
      </div>
      <p className="mt-1 text-[13px] font-normal text-ink-soft">
        Coordinatevi con il gruppo per il meetup.
      </p>
      <Link href={`/slot/${slot.id}/chat`} className={buttonClass('primary', 'md', true, 'mt-4')}>
        Apri la chat
        <ArrowRight className="h-4 w-4" strokeWidth={2} />
      </Link>
    </Card>
  ) : (
    <Card className="p-5 text-center lg:p-7">
      <div className="label-cap">La chat si apre tra</div>
      <div className="mt-3 flex items-center justify-center gap-2">
        <TimeCell value={tick.hours} label="ore" />
        <span className="font-mono text-[28px] font-bold text-ink-muted lg:text-[32px]">:</span>
        <TimeCell value={tick.minutes} label="min" />
        <span className="font-mono text-[28px] font-bold text-ink-muted lg:text-[32px]">:</span>
        <TimeCell value={tick.seconds} label="sec" />
      </div>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] font-medium text-ink-soft">
        <Clock className="h-3.5 w-3.5" strokeWidth={2} />3 ore prima del meetup
      </p>
    </Card>
  );

  const me = user ? participants.find((p) => p.userId === user.id) ?? null : null;
  const people = sortByAffinity(participants, me);
  const sameLabel = sameDestinationLabel(participants, me);

  const peopleList = (
    <ul className="space-y-2">
      {people.map((p) => (
        <li key={p.id}>
          <PersonRow
            name={p.profile.name}
            destination={p.destination}
            flightNumber={p.flightNumber}
            note={p.note}
            initials={initialsOf(p.profile.name)}
            color={p.profile.avatarColor}
            isMe={me ? p.userId === me.userId : false}
            match={matchKind(me, p)}
          />
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <MobileShell>
        <NavBar
          back={`/airport/${slot.airportCode.toLowerCase()}/${slot.id}`}
          right={airport && <Tag variant="filled">{airport.code}</Tag>}
        />

        <Card className="mb-4 p-4">
          <div className="label-cap">{formatDateIT(slot.date)}</div>
          <div className="mt-1 font-mono text-[34px] font-bold leading-none tracking-tight text-ink">
            {slot.startTime}
          </div>
          <div className="mt-1.5 text-[13px] font-medium text-ink-soft">
            {slot.meetingPoint} · {airport?.city ?? slot.airportCode}
          </div>
        </Card>

        <div className="mb-5">{countdownBox}</div>

        <div className="label-cap mb-2 ml-1">Nel gruppo</div>
        {peopleList}

        <div className="flex-1" />

        {joined && (
          <button
            type="button"
            onClick={onLeave}
            disabled={leaving}
            className="mt-5 block w-full text-center text-[12px] font-semibold text-ink-muted underline disabled:opacity-50"
          >
            {leaving ? 'Uscita…' : 'Esci dallo slot'}
          </button>
        )}
      </MobileShell>

      <DesktopShell activeNav="my-slots">
        <div className="mx-auto max-w-[860px]">
          <BackLink
            href={`/airport/${slot.airportCode.toLowerCase()}/${slot.id}`}
            label="Torna al dettaglio slot"
            className="mb-5"
          />

          <Card className="mb-6 flex items-center justify-between p-5">
            <div className="flex items-center gap-4">
              <div className="font-mono text-[36px] font-bold leading-none tracking-tight text-ink">
                {slot.startTime}
              </div>
              <div>
                <div className="label-cap">{formatDateIT(slot.date)}</div>
                <div className="mt-0.5 text-[14px] font-medium text-ink-soft">
                  {slot.meetingPoint} · {airport?.city ?? slot.airportCode}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {joined && (
                <span className="rounded-pill bg-success/15 px-3 py-1 text-[11px] font-semibold text-success">
                  Sei iscritto
                </span>
              )}
              {airport && <Tag variant="filled">{airport.code}</Tag>}
            </div>
          </Card>

          <div className="flex gap-6">
            <section className="flex-1">{countdownBox}</section>

            <aside className="w-[320px] flex-shrink-0">
              <div className="mb-2 flex items-center justify-between">
                <div className="label-cap">Nel gruppo</div>
                <span className="text-[11px] font-semibold text-ink-soft">
                  {participants.length} {participants.length === 1 ? 'persona' : 'persone'}
                  {sameLabel && ` · ${sameLabel}`}
                </span>
              </div>
              {peopleList}
            </aside>
          </div>

          {joined && (
            <button
              type="button"
              onClick={onLeave}
              disabled={leaving}
              className="mt-6 text-[12px] font-semibold text-ink-muted underline hover:text-ink-soft disabled:opacity-50"
            >
              {leaving ? 'Uscita…' : 'Esci dallo slot'}
            </button>
          )}
        </div>
      </DesktopShell>
    </>
  );
}

function TimeCell({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="min-w-[64px] rounded-sm border border-line bg-card-alt px-2 py-2 font-mono text-[32px] font-bold leading-none text-ink lg:min-w-[80px] lg:text-[40px] lg:py-3">
        {pad2(value)}
      </div>
      <div className="label-cap mt-1">{label}</div>
    </div>
  );
}
