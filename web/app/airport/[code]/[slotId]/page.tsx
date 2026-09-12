'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Clock } from 'lucide-react';
import { MobileShell } from '@/components/layout/MobileShell';
import { NavBar } from '@/components/layout/NavBar';
import { DesktopShell } from '@/components/layout/DesktopShell';
import { BackLink } from '@/components/layout/BackLink';
import { Card } from '@/components/ui/Card';
import { Tag } from '@/components/ui/Tag';
import { AvatarStack } from '@/components/ui/AvatarStack';
import { PersonRow } from '@/components/ui/PersonRow';
import { buttonClass } from '@/components/ui/Button';
import { useAuth } from '@/lib/useAuth';
import { fetchAirport } from '@/lib/api/airports';
import { fetchSlot, findExistingSlot } from '@/lib/api/slots';
import {
  buildVirtualSlot,
  isVirtualSlotId,
  parseVirtualSlotId,
} from '@/lib/api/virtual';
import type { SlotWithParticipants } from '@/lib/api/types';
import type { Airport } from '@/lib/types';
import { formatDateIT, initialsOf, todayIso } from '@/lib/utils';
import { matchKind, sameDestinationLabel, sortByAffinity } from '@/lib/affinity';

export default function SlotDetailPage({
  params,
}: {
  params: { code: string; slotId: string };
}) {
  const { user } = useAuth();

  const [airport, setAirport] = useState<Airport | null>(null);
  const [slot, setSlot] = useState<SlotWithParticipants | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    async function load() {
      const a = await fetchAirport(params.code);
      if (!a) {
        if (!cancelled) setMissing(true);
        return;
      }
      if (cancelled) return;
      setAirport(a);

      if (isVirtualSlotId(params.slotId)) {
        const parsed = parseVirtualSlotId(params.slotId);
        if (!parsed || parsed.airportCode !== a.code) {
          if (!cancelled) setMissing(true);
          return;
        }
        // If a real slot already exists for this identity, prefer it.
        const real = await findExistingSlot(parsed.airportCode, parsed.date, parsed.startTime);
        if (cancelled) return;
        if (real) {
          setSlot(real);
        } else {
          setSlot(buildVirtualSlot(parsed.airportCode, parsed.date, parsed.startTime));
        }
        return;
      }

      const s = await fetchSlot(params.slotId);
      if (cancelled) return;
      if (!s) {
        setMissing(true);
      } else {
        setSlot(s);
      }
    }

    load()
      .catch((e) => {
        console.error('slot detail fetch', e);
        if (!cancelled) setMissing(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [params.code, params.slotId]);

  const today = useMemo(() => todayIso(), []);

  if (missing) notFound();
  if (loading || !airport || !slot) {
    return (
      <>
        <MobileShell>
          <NavBar back={`/airport/${params.code.toLowerCase()}`} />
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

  const participants = slot.participants;
  const joined = user ? participants.some((p) => p.userId === user.id) : false;
  const avatars = participants.slice(0, 4).map((p) => ({
    initials: initialsOf(p.profile.name),
    color: p.profile.avatarColor,
  }));

  const cta = joined ? (
    <Link href={`/slot/${slot.id}`} className={buttonClass('primary', 'md', true)}>
      Apri lo slot
      <ArrowRight className="h-4 w-4" strokeWidth={2} />
    </Link>
  ) : (
    <Link href={`/join/${slot.id}`} className={buttonClass('primary', 'md', true)}>
      Partecipa
    </Link>
  );

  const me = user ? participants.find((p) => p.userId === user.id) ?? null : null;
  const people = sortByAffinity(participants, me);
  const sameLabel = sameDestinationLabel(participants, me);

  const peopleList = (
    <ul className="space-y-2">
      {participants.length === 0 && (
        <li>
          <Card dashed className="p-4 text-center text-[13px] font-medium text-ink-soft">
            Ancora nessuno. Sii il primo.
          </Card>
        </li>
      )}
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
          back={`/airport/${airport.code.toLowerCase()}`}
          right={<Tag variant="filled">{airport.code}</Tag>}
        />

        <Card className="mb-4 p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="label-cap">{formatDateIT(slot.date === today ? today : slot.date)}</div>
              <div className="mt-1 font-mono text-[34px] font-bold leading-none tracking-tight text-ink">
                {slot.startTime}
              </div>
              <div className="mt-1.5 text-[13px] font-medium text-ink-soft">
                {airport.name}
              </div>
            </div>
            <div className="text-right">
              <AvatarStack items={avatars} size={28} />
              <div className="mt-1.5 text-[11px] font-semibold text-ink-soft">
                {participants.length} {participants.length === 1 ? 'persona' : 'persone'}
                {sameLabel && ` · ${sameLabel}`}
              </div>
            </div>
          </div>
        </Card>

        <Card className="mb-5 bg-card-alt p-4">
          <div className="label-cap mb-1">Punto di ritrovo</div>
          <div className="text-[15px] font-semibold text-ink">{slot.meetingPoint}</div>
          <div className="mt-0.5 text-[12px] font-medium text-ink-soft">
            {slot.meetingNote}
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-[12px] font-semibold text-ink-soft">
            <Clock className="h-3.5 w-3.5" strokeWidth={2} />
            Finestra di {slot.durationMinutes} minuti
          </div>
        </Card>

        <div className="label-cap mb-2 ml-1">Chi c’è</div>
        {peopleList}

        <div className="flex-1" />

        <div className="sticky bottom-0 -mx-5 mt-5 border-t border-line bg-bg/95 px-5 py-4 backdrop-blur">
          {cta}
        </div>
      </MobileShell>

      <DesktopShell activeNav="airports">
        <div className="mx-auto max-w-[860px]">
          <BackLink
            href={`/airport/${airport.code.toLowerCase()}`}
            label={`Torna a ${airport.city}`}
            className="mb-5"
          />

          <div className="flex gap-6">
            <section className="flex-1">
              <Card className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="label-cap">
                      {formatDateIT(slot.date === today ? today : slot.date)}
                    </div>
                    <div className="mt-1.5 font-mono text-[40px] font-bold leading-none tracking-tight text-ink">
                      {slot.startTime}
                    </div>
                    <div className="mt-2 text-[14px] font-medium text-ink-soft">
                      {airport.name} ({airport.code})
                    </div>
                  </div>
                  <Tag variant="filled">{airport.code}</Tag>
                </div>
              </Card>

              <Card className="mt-4 bg-card-alt p-5">
                <div className="label-cap mb-1">Punto di ritrovo</div>
                <div className="text-[17px] font-semibold text-ink">{slot.meetingPoint}</div>
                <div className="mt-0.5 text-[13px] font-medium text-ink-soft">
                  {slot.meetingNote}
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-[12px] font-semibold text-ink-soft">
                  <Clock className="h-3.5 w-3.5" strokeWidth={2} />
                  Finestra di {slot.durationMinutes} minuti
                </div>
              </Card>

              <div className="mt-6">{cta}</div>
            </section>

            <aside className="w-[300px] flex-shrink-0">
              <div className="mb-2 flex items-center justify-between">
                <div className="label-cap">Chi c’è</div>
                <span className="text-[11px] font-semibold text-ink-soft">
                  {participants.length} {participants.length === 1 ? 'persona' : 'persone'}
                {sameLabel && ` · ${sameLabel}`}
                </span>
              </div>
              {peopleList}
            </aside>
          </div>
        </div>
      </DesktopShell>
    </>
  );
}
